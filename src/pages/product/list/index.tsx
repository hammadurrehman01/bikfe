import {
  Box,
  CircularProgress,
  Container,
  Stack,
  TextField,
} from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Layout, List } from 'components';
import TablesSkeleton from 'components/common/TableSkeleton';
import { PaginationBar } from 'components/ui/paginationBar';
import { IColumnProps } from 'devextreme-react/data-grid';
import { useProductData } from 'hooks/useProductData';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { RootState } from 'redux/store';
import { PRODUCT_URL } from 'routes';
import ProductService from 'services/product';
import { useDebounce } from 'use-debounce';

export default function Page() {
  // TODO: for upload image
  // const [uploadLoader, setUploadLoader] = useState(false);
  const user = useSelector((state: RootState) => state.user);
  const productService = new ProductService();
  const queryClient = useQueryClient();
  const COLUMNS: IColumnProps[] = [
    { dataField: 'name', caption: 'Name' },
    { dataField: 'oem', caption: 'OEM', width: '250px' },
  ];

  const [search, setSearch] = useState('');
  const [value] = useDebounce(search, 2000);

  const {
    products,
    isProductLoading,
    handleNext,
    handlePrevious,
    isPrevious,
    isNext,
  } = useProductData(value);

  const deleteProductMutat = useMutation({
    mutationFn: async (deleteid: number | undefined | string) =>
      await productService.ProductDelete(deleteid, user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ListProducts'] });
    },
    onError: () => {
      toast.error('ERROR: Mapped product cannot be deleted');
    },
  });

  const deleteFunction = (id: number | string) => {
    deleteProductMutat.mutate(id);
  };

  return (
    <div>
      <Box>
        <Container maxWidth={false}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 30,
              marginBottom: 10,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginLeft: '2rem',
              }}
            >
              <h2 style={{ fontWeight: 700, fontSize: '2rem' }}>
                Product List
              </h2>
            </Box>
            <div>
              {/* // TODO: for upload image */}
              {/* <div className="upload-btn-wrapper">
                {uploadLoader ? (
                  <CircularProgress />
                ) : (
                  <>
                    <button className="btn">Upload File</button>
                    <input type="file" name="myfile" onChange={fileUpload} />
                  </>
                )}
              </div> */}
              <TextField
                sx={{ marginRight: '2rem' }}
                placeholder="Name or OEM"
                onChange={e => {
                  setSearch(e.target.value);
                }}
                hiddenLabel
                id="filled-hidden-label-normal"
                variant="filled"
              />
            </div>
          </div>
          <div
            style={{ minWidth: '300px', maxWidth: '100%', overflowX: 'auto' }}
          >
            {isProductLoading ? (
              <TablesSkeleton numberOfRows={6} sx={{ gap: '20px' }} />
            ) : (
              <div>
                <List
                  columns={COLUMNS}
                  content={products}
                  editCol={true}
                  url={PRODUCT_URL}
                  deleteFunction={deleteFunction}
                  imgCol={true}
                  mapCol={true}
                  deleteCol={true}
                />
              </div>
            )}
            <div>
              <PaginationBar
                isNext={isNext}
                isPrevious={isPrevious}
                handlePrevious={handlePrevious}
                handleNext={handleNext}
              />
            </div>
          </div>
        </Container>
      </Box>
    </div>
  );
}

Page.getLayout = (page: JSX.Element) => (
  <Layout heading={'LIST'}>{page}</Layout>
);
