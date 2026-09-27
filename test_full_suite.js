const BASE = 'http://localhost:5000/api';

async function runTests() {
  console.log('🧪 ====================================================');
  console.log('   LOCAL SERVICE FINDER - FULL SUITE AUTOMATED TESTS');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  const assert = (condition, testName) => {
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${testName}`);
      failed++;
    }
  };

  try {
    // 1. Health Check
    const healthRes = await fetch(`${BASE}/health`).then(r => r.json());
    assert(healthRes.status === 'online', '1. Server Health Check Endpoint');

    // 2. Fetch Categories
    const catRes = await fetch(`${BASE}/categories`).then(r => r.json());
    assert(catRes.success && catRes.categories.length >= 10, `2. Categories Loaded (${catRes.count} categories)`);

    // 3. Search Providers (Emergency & Category Filters)
    const searchRes = await fetch(`${BASE}/providers?emergency=true`).then(r => r.json());
    assert(searchRes.success && searchRes.providers.length > 0, `3. Search Providers (Emergency 24/7 filter found ${searchRes.count} pros)`);

    // 4. Customer Login
    const custLoginRes = await fetch(`${BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'customer@example.com', password: 'password123' })
    }).then(r => r.json());
    assert(custLoginRes.success && custLoginRes.token && custLoginRes.user.role === 'customer', '4. Customer Login (Aman Sharma)');
    const custToken = custLoginRes.token;

    // 5. Provider Login
    const provLoginRes = await fetch(`${BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'ramesh.electric@example.com', password: 'password123' })
    }).then(r => r.json());
    assert(provLoginRes.success && provLoginRes.token && provLoginRes.user.role === 'provider', '5. Provider Login (Ramesh Kumar - Electrician)');
    const provToken = provLoginRes.token;

    // 6. Create Service Booking (Customer -> Provider 1)
    const bookRes = await fetch(`${BASE}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${custToken}`
      },
      body: JSON.stringify({
        provider_id: 1,
        service_id: 2,
        service_title: 'Emergency Short-Circuit Diagnosis',
        booking_date: '2026-08-25',
        booking_time: '10:00 AM - 12:00 PM',
        total_price: 499,
        customer_address: 'B-42, Malviya Nagar, Jaipur',
        customer_phone: '+91 98290 12345',
        notes: 'Tripping MCB in kitchen area'
      })
    }).then(r => r.json());
    assert(bookRes.success && bookRes.bookingId, `6. Create Booking (Booking #${bookRes.bookingId} created)`);
    const newBookingId = bookRes.bookingId;

    // 7. Provider updates booking status: pending -> accepted
    const acceptRes = await fetch(`${BASE}/bookings/${newBookingId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${provToken}`
      },
      body: JSON.stringify({ status: 'accepted' })
    }).then(r => r.json());
    assert(acceptRes.success && acceptRes.status === 'accepted', '7. Provider Accepts Booking');

    // 8. Provider marks booking as completed
    const completeRes = await fetch(`${BASE}/bookings/${newBookingId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${provToken}`
      },
      body: JSON.stringify({ status: 'completed' })
    }).then(r => r.json());
    assert(completeRes.success && completeRes.status === 'completed', '8. Provider Marks Booking as Completed');

    // 9. Customer submits 5-Star Review
    const reviewRes = await fetch(`${BASE}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${custToken}`
      },
      body: JSON.stringify({
        booking_id: newBookingId,
        provider_id: 1,
        rating: 5,
        comment: 'Ramesh arrived within 20 mins, diagnosed the short circuit immediately, and fixed the burnt wire safely. 5-star service!'
      })
    }).then(r => r.json());
    assert(reviewRes.success && reviewRes.reviewId, '9. Customer Submits 5-Star Review');
    const newReviewId = reviewRes.reviewId;

    // 10. Provider replies to review
    const replyRes = await fetch(`${BASE}/reviews/${newReviewId}/reply`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${provToken}`
      },
      body: JSON.stringify({ provider_response: 'Glad to assist you in emergency Aman ji! Safe electricals always!' })
    }).then(r => r.json());
    assert(replyRes.success, '10. Provider Posts Official Reply to Review');

    // 11. Customer adds Provider to Favorites
    const favRes = await fetch(`${BASE}/favorites`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${custToken}`
      },
      body: JSON.stringify({ provider_id: 1 })
    }).then(r => r.json());
    assert(favRes.success, '11. Customer Adds Provider to Favorites');

    // 12. Customer sends Message to Provider
    const msgRes = await fetch(`${BASE}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${custToken}`
      },
      body: JSON.stringify({
        receiver_id: 4, // Provider user_id for Ramesh
        booking_id: newBookingId,
        message: 'Hello Ramesh ji, thank you for the quick electrical fix today!'
      })
    }).then(r => r.json());
    assert(msgRes.success && msgRes.sentMessage, '12. Customer ↔ Provider In-App Chat Message Sent');

    // 13. Provider Dashboard Stats Retrieval
    const provStatsRes = await fetch(`${BASE}/stats/provider`, {
      headers: { 'Authorization': `Bearer ${provToken}` }
    }).then(r => r.json());
    assert(provStatsRes.success && provStatsRes.stats.totalBookings > 0, `13. Provider Stats (Earnings: ₹${provStatsRes.stats.totalEarnings}, Rating: ${provStatsRes.stats.averageRating}⭐)`);

    // 14. Customer Dashboard Stats Retrieval
    const custStatsRes = await fetch(`${BASE}/stats/customer`, {
      headers: { 'Authorization': `Bearer ${custToken}` }
    }).then(r => r.json());
    assert(custStatsRes.success && custStatsRes.stats.totalBookings > 0, `14. Customer Stats (Total Bookings: ${custStatsRes.stats.totalBookings}, Favorites: ${custStatsRes.stats.totalFavorites})`);

    // 15. Toggle Provider Availability
    const toggleRes = await fetch(`${BASE}/providers/availability`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${provToken}`
      },
      body: JSON.stringify({ is_available: false })
    }).then(r => r.json());
    assert(toggleRes.success && toggleRes.is_available === false, '15. Provider Toggles Availability to Offline');

    // 16. Admin Login & Stats Retrieval
    const adminLoginRes = await fetch(`${BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@example.com', password: 'password123' })
    }).then(r => r.json());
    assert(adminLoginRes.success && adminLoginRes.user.role === 'admin', '16. Admin Authentication');
    const adminToken = adminLoginRes.token;

    const adminStatsRes = await fetch(`${BASE}/admin/stats`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    }).then(r => r.json());
    assert(adminStatsRes.success && adminStatsRes.stats.totalUsers > 0, `17. Admin Dashboard KPI Stats (${adminStatsRes.stats.totalUsers} users, ₹${adminStatsRes.stats.totalRevenue} revenue)`);

    // 17. In-App Notifications
    const notifRes = await fetch(`${BASE}/notifications`, {
      headers: { 'Authorization': `Bearer ${custToken}` }
    }).then(r => r.json());
    assert(notifRes.success && Array.isArray(notifRes.notifications), `18. In-App User Notifications (${notifRes.count} notifications retrieved)`);

    // 18. Double-Booking Slot Collision Prevention
    const doubleBookRes = await fetch(`${BASE}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${custToken}`
      },
      body: JSON.stringify({
        provider_id: 5,
        service_id: 12,
        service_title: 'Split AC Foam Jet Deep Wash',
        booking_date: '2026-08-21',
        booking_time: '02:00 PM - 04:00 PM',
        total_price: 599,
        customer_address: 'B-42, Malviya Nagar, Jaipur'
      })
    });
    assert(doubleBookRes.status === 409, '19. Double-Booking Slot Collision Guard (Prevented overlapping slot with HTTP 409)');

  } catch (err) {
    console.error('Test Suite Error:', err);
    failed++;
  }

  console.log('\n====================================================');
  console.log(`📊 TEST RESULTS SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================\n');
}

runTests();
