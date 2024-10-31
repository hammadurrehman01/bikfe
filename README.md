Introduction
AfterMarket invoice is a SaaS software that allow after market parts seller to connect their customer and product products to a product directory, and use the product mapping to generate Invoices, and Bills.

Core Concept of the App
There are 3 keys concpets in the app.

Customers: The Customers are list of are a list of customer in the app. Each customer will have multiple address and phones numbers.
Vendors: The Vendors are list of are a list of vendor in the app. Each vendor will have multiple address and phones numbers.
Products: The Products are list of products in the app.
Additional Concept
Product Mapping: How the core product list links with each customer, and vendor.
Invoices: Generate invoices for customers, which the product mapping keys, prices and qty.
Bills: Generate bills for vendors, which the product mapping keys, prices and qty.
Product Mapping Concept
In this app, we need to link a product to a customer, and a vendor. The concept of this feature is as follows. Let's say we have the following product

{
    'productId': 1001,
    'productName: 'Water Bottle',
    'oem': '123-wb',
}
We would have to map this product with a customer. Let say we have the following information about the customer

{
    'customerId': 1,
    'company_name': 'International Supplier'
}
Since each customer will potentially have their own code for the product, we need to have that information as well. This why we have a product mapping concept in the app. The object will look like this for it

{
    'productMappingId': 1,
    'customerId': 1,
    'productId': 1001,
    'code': 'is-wb-200'
}
The code can be any alphanumeric string of their choice. 

The same principle will apply for Vendor and Product, when we are doing the product mapping.

Invoices & Bills Concept:
Now that we have the concept of Product mapping in our system. This is what we would leverage to craete invoices or bills. The difference between invoices and bills are that invoices are for customers, and bills are for vendor. Principally the work the same way. To under invoices we need to look at the invoice object.

{
    'invoiceId': 1,
    'invoiceDate': '2024-01-01',
    'invoiceCurrency': 'USD',
    'customerId': 1,
    invoiceitems: [
        {
            'invoiceItemId': 1,
            'productMappingId': 1,
            'price': 100,
            'qty': 10
        }
    ]
}
As you can see the invoice has invoice items, this is to allow of the invoices to have multiple invoice items in each invoice. Following are some of the checks that we need to do when we are creating or updating and invoices

When a product is being added to invoice items, we need to check if the product has mapping with the customer. If we don't have a product mapping between the customer and product, we need to request that from the customer 1st, and we don't have we can never add that product in to the invoice item.
In the UI we will search based on the Product and not ProductMapping. Once the user select the Product, we would need to get the ProductMappingId from the Product Mapping table, so we can use it when we are inserting it in the invoice items.