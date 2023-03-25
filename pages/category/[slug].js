import ProductCard from "@/components/ProductCard";
import Wrapper from "@/components/Wrapper";
import { FetchDataFromApi } from "@/utils/api";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { useRouter } from "next/router";

const maxResult = 3;

const Category = ({ category, products, slug }) => {
   const [pageIndex, setPageIndex] = useState(1);

   const { query } = useRouter();

   useEffect(() => {
      setPageIndex(1);
   }, [query]);

   const { data, error, isLoading } = useSWR(`/api/products?populate=*&filters[categories][slug][$eq]=${slug}&pagination[page]=${pageIndex}&pagination[pageSize]=${maxResult}`, FetchDataFromApi, { fallbackData: products });

   return (
      <div className="w-full md:py-20 relative">
         <Wrapper>
            <div className="text-center max-w-[800px] mx-auto mt-8 md:mt-0">
               <div className="text-[28px] md:text-[34px] mb-5 font-semibold leading-tight">{category?.data?.[0]?.attributes?.name}</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-14 px-5 md:px-0">
               {data?.data?.map((product) => (
                  <ProductCard key={product?.id} data={product} />
               ))}
            </div>
            {data?.meta?.pagination?.total > maxResult && (
               <div className="flex gap-3 items-center justify-center my-16 md:my-0">
                  <button className={`rounded py-2 px-4 bg-black text-white disabled:bg-gray-200 disabled:text-gray-500`} disabled={pageIndex === 1} onClick={() => setPageIndex(pageIndex - 1)}>
                     Previous
                  </button>

                  <span className="font-bold">{`${pageIndex} of ${data && data?.meta?.pagination?.pageCount}`}</span>

                  <button className={`rounded py-2 px-4 bg-black text-white disabled:bg-gray-200 disabled:text-gray-500`} disabled={pageIndex === (data && data?.meta?.pagination?.pageCount)} onClick={() => setPageIndex(pageIndex + 1)}>
                     Next
                  </button>
               </div>
            )}
            {/* PAGINATION BUTTONS END */}
            {isLoading && (
               <div className="absolute top-0 left-0 w-full h-full bg-white/[0.5] flex flex-col gap-5 justify-center items-center">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                     <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
                  </div>
               </div>
            )}
         </Wrapper>
      </div>
   );
};

export default Category;

export async function getStaticPaths() {
   const category = await FetchDataFromApi("/api/categories?populate=*");

   const paths = category?.data?.map((c) => ({
      params: {
         slug: c?.attributes?.slug,
      },
   }));

   return {
      paths,
      fallback: false,
   };
}

export async function getStaticProps({ params: { slug } }) {
   const category = await FetchDataFromApi(`/api/categories?filters[slug][$eq]=${slug}`);
   const products = await FetchDataFromApi(`/api/products?populate=*&filters[categories][slug][$eq]=${slug}&pagination[page]=1&pagination[pageSize]=${maxResult}`);
   return {
      props: { category, products, slug },
   };
}
