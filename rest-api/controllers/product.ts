import { Product } from '../types.ts'; 
import { v4 } from 'https://deno.land/std/uuid/mod.ts';

let products: Product[] = [
    { 
        id: "1",
        name: "Product One",
        description: "This is description",
        price: 29.99
    },
    { 
        id: "2",
        name: "Product Two",
        description: "This is description",
        price: 19.99
    }
];

// @desc Get all products
// @route GET /api/v1/products
const getProducts = ({ response }: { response: any}) => {
    response.body = {
        success: true,
        data: products
    }
}


// @desc Get single product
// @route GET /api/v1/products/:id
const getProduct = async ({ params, response }: { params: { id: string}, response: any}) => {
    const product: Product | undefined = products.find(p => p.id === params.id) 
    if(product) {
       response.status = 200;
        response.body = {
            success: true,
            data: product
        } 
    }else {
            response.status = 404;
            response.body = {
               success: false,
                msg: "No product found"
            }
    }
}


// @desc Add  product
// @route POST /api/v1/products
const addProduct = async ({ response, request }: { response: any, request: any}) => {
    const body = await request.body();
    if(!request.hasBody){
        response.status = 400;
        response.body = {
            success: false,
            msg: "No data"
        }
    } else {
        let bodyValue: any = await body.value;
        let product: Product =  JSON.parse(bodyValue);
        
        product.id = v4.generate();
        products.push(product);
        console.log(product, 'product');
        response.status = 201;
        response.body = {
            success: true,
            data: product
        }

    }
}

// @desc Update  product
// @route PUT /api/v1/products/:id
const updateProduct = async ({ response, params,  request }: { response: any, params: { id: string}, request: any}) => {
    const product: Product| undefined = products.find(p => p.id === params.id);
    if(product){
        const body = await request.body();
        
        const updateData: { name?: string, description?: string, price?: number} = await body.value;
        products = products.map(p => p.id === params.id? ({...p, ...updateData }): p);
       
        response.status = 200;
        response.body = {
            success: true,
            data: products
        }
    } else {
        response.status = 404;
        response.body = {
            success: false,
            msg: 'No product found'
        }
    }
}


// @desc Delete  product
// @route DELETE /api/v1/products
const deleteProduct = ({ response, params }: { response: any, params: { id: string}}) => {
   const index = products.findIndex(p => p.id === params.id);
   if(index >=0 ){
    products.splice(index, 1);
    response.status = 200; 
    response.body = {
            success: true,
            data: 'Product removed'
        }
    } else {
        response.status = 404;
        response.body = {
            success: false,
            data: "No product found"
        }
    }
   
}

export { getProducts, getProduct, addProduct, updateProduct, deleteProduct };