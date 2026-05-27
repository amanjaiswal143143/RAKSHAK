import { supabase } from '../../supabase/client';

export const tripSharingService = {

  async getTripLocations(
    trackingId
  ) {

    const { data, error } =
      await supabase
        .from('live_tracking')
        .select('*')
        .eq(
          'tracking_id',
          trackingId
        )
        .order(
          'updated_at',
          {
            ascending: false,
          }
        );

    if (error) {

      console.log(error);

      return [];
    }

    return data || [];
  },
};