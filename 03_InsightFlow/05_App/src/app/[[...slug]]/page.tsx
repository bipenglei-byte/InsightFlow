import {ProductApp} from "@/components/product-app";
export default async function Page({params}:{params:Promise<{slug?:string[]}>}){const {slug=[]}=await params;return <ProductApp route={slug}/>}
