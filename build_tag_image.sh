# for test/uat
docker build . -f .\Dockerfile.test -t aftermarket_invoice_frontend:test
docker tag aftermarket_invoice_frontend:test techlabscc/internal:aftermarket_invoice_frontend_test
docker push techlabscc/internal:aftermarket_invoice_frontend_test

# for prod
docker build . -f .\Dockerfile.prod -t aftermarket_invoice_frontend:prod
docker tag aftermarket_invoice_frontend:prod techlabscc/internal:aftermarket_invoice_frontend_prod
docker push techlabscc/internal:aftermarket_invoice_frontend_prod

# pull scripts
# docker stop aftermarket_invoice_frontend
# docker rm aftermarket_invoice_frontend
# docker rmi techlabscc/internal:aftermarket_invoice_frontend
# docker pull techlabscc/internal:aftermarket_invoice_frontend
# docker run --restart always -p1001:3000 techlabscc/internal:aftermarket_invoice_frontend
