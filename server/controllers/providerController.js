import { query } from '../config/db.js';

/**
 * Search & filter service providers
 * GET /api/providers or GET /api/search
 */
export async function getProviders(req, res, next) {
  try {
    const {
      q,
      category,
      location,
      area,
      rating,
      min_price,
      max_price,
      availability,
      emergency,
      sort = 'smart'
    } = req.query;

    const allProviders = await query('SELECT * FROM `service_providers`');

    let filtered = [...allProviders];

    // Filter by Emergency
    if (emergency === 'true' || emergency === '1') {
      filtered = filtered.filter(p => p.is_emergency === 1);
    }

    // Filter by Availability
    if (availability === 'true' || availability === '1') {
      filtered = filtered.filter(p => p.is_available === 1);
    }

    // Filter by Category (id or slug or name)
    if (category) {
      const catVal = String(category).toLowerCase();
      filtered = filtered.filter(p => {
        const catIdMatch = p.category_id === Number(catVal);
        const catSlugMatch = p.category_slug && p.category_slug.toLowerCase() === catVal;
        const catNameMatch = p.category_name && p.category_name.toLowerCase().includes(catVal);
        return catIdMatch || catSlugMatch || catNameMatch;
      });
    }

    // Filter by Location / Area / City
    if (location) {
      const locVal = String(location).toLowerCase().trim();
      filtered = filtered.filter(p => {
        const matchCity = p.city && p.city.toLowerCase().includes(locVal);
        const matchArea = p.area && p.area.toLowerCase().includes(locVal);
        const matchUserCity = p.user_city && p.user_city.toLowerCase().includes(locVal);
        return matchCity || matchArea || matchUserCity;
      });
    }

    if (area) {
      const areaVal = String(area).toLowerCase().trim();
      filtered = filtered.filter(p => p.area && p.area.toLowerCase().includes(areaVal));
    }

    // Filter by Minimum Rating
    if (rating) {
      const minRating = parseFloat(rating);
      filtered = filtered.filter(p => Number(p.rating) >= minRating);
    }

    // Filter by Price range
    if (min_price) {
      filtered = filtered.filter(p => Number(p.hourly_rate) >= parseFloat(min_price));
    }
    if (max_price) {
      filtered = filtered.filter(p => Number(p.hourly_rate) <= parseFloat(max_price));
    }

    // Free text keyword search
    if (q) {
      const term = String(q).toLowerCase().trim();
      filtered = filtered.filter(p => {
        const inBusiness = p.business_name && p.business_name.toLowerCase().includes(term);
        const inTagline = p.tagline && p.tagline.toLowerCase().includes(term);
        const inBio = p.bio && p.bio.toLowerCase().includes(term);
        const inCategory = p.category_name && p.category_name.toLowerCase().includes(term);
        const inServices = p.services && p.services.some(s => s.title.toLowerCase().includes(term) || (s.description && s.description.toLowerCase().includes(term)));
        const inArea = p.area && p.area.toLowerCase().includes(term);
        return inBusiness || inTagline || inBio || inCategory || inServices || inArea;
      });
    }

    // Intelligent / Custom Sorting
    if (sort === 'rating_desc' || sort === 'rating') {
      filtered.sort((a, b) => Number(b.rating) - Number(a.rating));
    } else if (sort === 'price_asc') {
      filtered.sort((a, b) => Number(a.hourly_rate) - Number(b.hourly_rate));
    } else if (sort === 'price_desc') {
      filtered.sort((a, b) => Number(b.hourly_rate) - Number(a.hourly_rate));
    } else if (sort === 'experience') {
      filtered.sort((a, b) => Number(b.experience_years) - Number(a.experience_years));
    } else if (sort === 'reviews') {
      filtered.sort((a, b) => Number(b.total_reviews) - Number(a.total_reviews));
    } else {
      // 'smart' default: Prioritize Available, then High Rating, then Total Reviews
      filtered.sort((a, b) => {
        if (b.is_available !== a.is_available) {
          return b.is_available - a.is_available;
        }
        if (b.rating !== a.rating) {
          return Number(b.rating) - Number(a.rating);
        }
        return Number(b.total_reviews) - Number(a.total_reviews);
      });
    }

    res.status(200).json({
      success: true,
      count: filtered.length,
      providers: filtered
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get Provider Profile Details by ID
 * GET /api/providers/:id
 */
export async function getProviderById(req, res, next) {
  try {
    const { id } = req.params;
    const providers = await query('SELECT * FROM `service_providers` WHERE `id` = ?', [Number(id)]);

    if (!providers || providers.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Service Provider not found.'
      });
    }

    const provider = providers[0];
    const services = await query('SELECT * FROM `services` WHERE `provider_id` = ?', [provider.id]);
    const reviews = await query('SELECT * FROM `reviews` WHERE `provider_id` = ?', [provider.id]);

    res.status(200).json({
      success: true,
      provider: {
        ...provider,
        services,
        reviews
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Update Provider Profile (For Provider user)
 * PUT /api/providers/profile
 */
export async function updateProviderProfile(req, res, next) {
  try {
    const userId = req.user.id;
    const {
      business_name,
      tagline,
      bio,
      experience_years,
      hourly_rate,
      area,
      city,
      working_hours,
      is_emergency,
      category_id
    } = req.body;

    const existing = await query('SELECT * FROM `service_providers` WHERE `user_id` = ?', [userId]);
    if (!existing || existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Provider profile not found for this account.'
      });
    }

    await query(
      `UPDATE \`service_providers\` 
       SET \`business_name\` = COALESCE(?, \`business_name\`),
           \`tagline\` = COALESCE(?, \`tagline\`),
           \`bio\` = COALESCE(?, \`bio\`),
           \`experience_years\` = COALESCE(?, \`experience_years\`),
           \`hourly_rate\` = COALESCE(?, \`hourly_rate\`),
           \`area\` = COALESCE(?, \`area\`),
           \`city\` = COALESCE(?, \`city\`),
           \`working_hours\` = COALESCE(?, \`working_hours\`),
           \`is_emergency\` = COALESCE(?, \`is_emergency\`),
           \`category_id\` = COALESCE(?, \`category_id\`)
       WHERE \`user_id\` = ?`,
      [business_name, tagline, bio, experience_years, hourly_rate, area, city, working_hours, is_emergency !== undefined ? (is_emergency ? 1 : 0) : null, category_id, userId]
    );

    const updated = await query('SELECT * FROM `service_providers` WHERE `user_id` = ?', [userId]);

    res.status(200).json({
      success: true,
      message: 'Provider profile updated successfully!',
      provider: updated[0]
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Toggle Provider Availability (Online / Offline)
 * PUT /api/providers/availability
 */
export async function toggleAvailability(req, res, next) {
  try {
    const userId = req.user.id;
    const { is_available } = req.body;

    const providers = await query('SELECT * FROM `service_providers` WHERE `user_id` = ?', [userId]);
    if (!providers || providers.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Provider profile not found.'
      });
    }

    const newStatus = is_available !== undefined ? (is_available ? 1 : 0) : (providers[0].is_available ? 0 : 1);

    await query('UPDATE `service_providers` SET `is_available` = ? WHERE `user_id` = ?', [newStatus, userId]);

    res.status(200).json({
      success: true,
      message: `Status updated to ${newStatus === 1 ? 'Available' : 'Unavailable'}`,
      is_available: newStatus === 1
    });
  } catch (error) {
    next(error);
  }
}

export default { getProviders, getProviderById, updateProviderProfile, toggleAvailability };
