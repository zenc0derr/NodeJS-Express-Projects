const { QueryCursor } = require('mongoose')
const Product = require('../models/product')

const getAllProductsStatic = async (req, res) => {
    //throw new Error('testing async error')
    const products = await Product.find({}).sort('name')
    res.status(200).json({products, nbHits:products.length})
}

const getAllProducts = async (req, res) => {
    const {featured,company,name, sort, fields, numericFilters} = req.query

    const queryObject = {}

    if(featured){
        queryObject.featured = featured === 'true'?true:false
    }
    if(company){
        queryObject.company = company
    }
    if(name){
        queryObject.name = {$regex: name, $options:'i'}
    }
    if(numericFilters){
        const operatorsMap = {
            '>':'$gt',
            '>=':'$gte',
            '<':'$lt',
            '<=':'$lte',
            '=':'$eq'
        }
        const regEx = /\b(<|>|=|>=|<=)\b/g
        let filters = numericFilters.replace(regEx,(match)=>`-${operatorsMap[match]}-`)
        
        const options = ['price','rating'];
        filters = filters.split(',').forEach(item => {
            const [field,operator,value] = item.split('-')
            if(options.includes(fields)){
                queryObject[field] = {[operator]:Number(value)}
            }
        });
    }

    console.log(queryObject)

    let result = Product.find(queryObject)

    //sorting
    if(sort){
        const sortList = sort.split(',').join(' ')
        result = result.sort(sortList)
    }else{
        result = result.sort('createdAt')
    }

    //selection
    if(fields){
        const fieldsList = fields.split(',').join(' ')
        result = result.select(fieldsList)
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    result = result.skip(skip).limit(limit)

    const products = await result
    res.status(200).json({products, nbHits:products.length})
}

module.exports = {
    getAllProducts,
    getAllProductsStatic
}