export type EventEngagementCounts = {
  likesCount: number;
  viewsCount: number;
  sharesCount: number;
};

export function engagementFromRow(row: {
  favorites_count?: number | null;
  views_count?: number | null;
  shares_count?: number | null;
}): EventEngagementCounts {
  return {
    likesCount: Number(row.favorites_count ?? 0),
    viewsCount: Number(row.views_count ?? 0),
    sharesCount: Number(row.shares_count ?? 0),
  };
}

export function formatEngagementCount(value: number) {
  return new Intl.NumberFormat("it-IT").format(value);
}
