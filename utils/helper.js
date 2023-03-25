export const getDiscountedPricePercentage = (originalPrice, discountedPrice) => {
   const discount = originalPrice - discountedPrice;
   const discountPrecentage = (discount / originalPrice) * 100;
   return discountPrecentage.toFixed();
};
