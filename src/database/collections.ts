export enum Collection {
    LP_SWAPS = "lp_swaps",
};

export const collections_arr = Object.entries(Collection).map(([_, value]) => value);