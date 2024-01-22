import {promises as fs} from "fs"

export default class ProductManager {
    constructor(){
        this.path = "./productos.json";
        this.products = [];
    }

    static id = 0;

    addProduct = async (title, description, price, thumbnail, code, stock) => {
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            console.log(`Todos los campos son obligatorios en el producto ${title}`);
            return;
        }

        const codeExists = this.products.some(product => product.code === code);
        if (codeExists) {
            console.log(`El producto ${title} tiene un ERROR, el código ${code} esta repetido`);
            return;
        }

        ProductManager.id++;
        
        let newProduct = {
            id: ProductManager.id,
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        }

        this.products.push(newProduct);
        await fs.writeFile(this.path, JSON.stringify(this.products, null, 2));
        this.products = await this.readProducts();
    };

    readProducts = async () => {
        try {
            let respuesta = await fs.readFile(this.path, "utf-8");
            // Verifico si el archivo está vacío o no existe
            if (!respuesta.trim()) {
                return '[]'; // Devolver un array vacío
            }
            return JSON.parse(respuesta);
        } catch (error) {
            console.error("Error al leer productos:", error);
            return '[]'; // Devolver un array vacío en caso de error
        }
    }

    getProducts = async () => { 
        let respuesta2;
        
        try {
            respuesta2 = await this.readProducts();
        } catch (error) {
            // Manejar el error si ocurre al leer el archivo (puede no existir aún)
            console.error("Error al leer productos:", error);
            respuesta2 = '[]'; // Devolver un arreglo vacío en caso de error
        }

        console.log(respuesta2);
        return respuesta2;
    }

    getProductsById = async (id) => {
        try {
            let respuesta3 = await this.readProducts();

            const product = respuesta3.find(product => product.id === id);

            if (!product) {
                console.log("Producto no encontrado");
            } else {
                console.log(product);
            }
        } catch (error) {
            console.error("Error al obtener el producto por ID:", error);
        }
    }

    deleteProductById = async (id) => {
        try {
            let respuesta = await this.readProducts();
            let productFilter = respuesta.filter(product => product.id != id);
            await fs.writeFile(this.path, JSON.stringify(productFilter, null, 2));
            console.log("Producto Eliminado");
        } catch (error) {
            console.error("Error al eliminar el producto:", error);
        }
    }

    updateProducts = async ({ id, ...producto }) => {
        try {
            // Guardar el producto antiguo antes de eliminarlo
            const oldProduct = await this.getProductsById(id);
            
            // Eliminar el producto antiguo
            await this.deleteProductById(id);

            // Obtener la lista actualizada de productos
            const updatedProducts = await this.readProducts();

            // Actualizar el producto en la lista
            const updatedProductList = [
                ...updatedProducts,
                {id, ...producto}
            ];

            // Escribir la lista actualizada al archivo
            await fs.writeFile(this.path, JSON.stringify(updatedProductList, null, 2));
            
            console.log("Producto Actualizado");
        } catch (error) {
            console.error("Error al actualizar el producto:", error);
        }
    }

}


 const productos = new ProductManager;