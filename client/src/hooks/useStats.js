import { useMemo } from 'react';

export function useStats(gigs) {
  return useMemo(() => {
    if (!gigs || gigs.length === 0) {
      return {
        totalGigs: 0,
        gigsThisYear: 0,
        topVenues: [],
        topArtists: [],
        pintStats: { average: 0, mostExpensive: null, totalPints: 0 },
      };
    }

    const currentYear = new Date().getFullYear();

    const totalGigs = gigs.length;

    const gigsThisYear = gigs.filter((g) => {
      const dateOnly = String(g.gig_date || '').split('T')[0];
      const year = new Date(dateOnly + 'T12:00:00').getFullYear();
      return year === currentYear;
    }).length;

    const venueCounts = {};
    const artistCounts = {};
    let totalSpend = 0;
    let pintCount = 0;
    let mostExpensivePint = null;

    gigs.forEach((gig) => {
      if (gig.venue_name_snapshot) {
        venueCounts[gig.venue_name_snapshot] =
          (venueCounts[gig.venue_name_snapshot] || 0) + 1;
      }

      if (gig.artist_text) {
        artistCounts[gig.artist_text] =
          (artistCounts[gig.artist_text] || 0) + 1;
      }

      const items = Array.isArray(gig.spend_items) ? gig.spend_items : [];
      if (items.length > 0) {
        items.forEach((item) => {
          totalSpend += item.amount || 0;
          if (item.is_pint) {
            pintCount++;
            if (
              !mostExpensivePint ||
              item.amount > mostExpensivePint.price
            ) {
              mostExpensivePint = {
                price: item.amount,
                venue: gig.venue_name_snapshot,
                label: item.label,
              };
            }
          }
        });
      }
    });

    const topVenues = Object.entries(venueCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const topArtists = Object.entries(artistCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const averagePintPrice = pintCount > 0 ? totalSpend / pintCount : 0;

    return {
      totalGigs,
      gigsThisYear,
      topVenues,
      topArtists,
      pintStats: {
        average: averagePintPrice,
        mostExpensive: mostExpensivePint,
        totalPints: pintCount,
      },
    };
  }, [gigs]);
}
