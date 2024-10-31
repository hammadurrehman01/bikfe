import { CircularProgress } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { AppModal, Card } from 'components';
import DataGrid, {
  Column,
  Editing,
  GroupPanel,
  Grouping,
  IColumnProps,
  Selection,
} from 'devextreme-react/data-grid';
import 'devextreme/dist/css/dx.material.blue.light.css';
import { ErrorResponse } from 'interface/ApiError';
import Image from 'next/image';
import { useRouter } from 'next/router';
import NO_IMAGE from 'public/images/fake photo.png';
import { memo, useMemo, useState } from 'react';
import 'react-medium-image-zoom/dist/styles.css';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { RootState } from 'redux/store';
import Billervice from 'services/bill';
import InvoiceService from 'services/invoice';

type Props<TData> = {
  columns: IColumnProps[];
  url?: string;
  content: TData[];
  selection?: boolean;
  onSelection?: (list: TData[]) => void;
  customURL?: (item: string) => string;
  editable?: boolean;
  editCol?: boolean;
  deleteCol?: boolean;
  setID?: any;
  imgCol?: boolean;
  mapCol?: boolean;
  detailCol?: boolean;
  downloadCol?: Boolean;
  downloadID?: any;
  deleteFunction?: any;
  isModal?: boolean;
  downloadLoading?: boolean;
  selectedDownloadId?: string | number;
  handleModal?: () => void;
  setData?: (input: any) => void;
  invoiceId?: number;
  billId?: number;
};

const ListComponent = <
  TData extends {
    image?: string | undefined | null;
    id?: number | undefined;
  },
>({
  downloadCol,
  downloadID,
  url,
  columns,
  content,
  selection,
  onSelection,
  deleteFunction,
  customURL,
  editable,
  editCol,
  deleteCol,
  setID,
  imgCol,
  mapCol,
  detailCol,
  invoiceId,
  isModal,
  downloadLoading = false,
  selectedDownloadId,
  handleModal,
  setData,
  billId,
}: Props<TData | any>) => {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const handleOpen = (id: any) => {
    setDeleteId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setDeleteId(null);
    setOpen(false);
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteFunction(deleteId);
      handleClose();
    }
  };

  const DeleteBillItem = useMutation({
    mutationFn: async (deleteid: number | undefined | string) => {
      const billService = new Billervice();
      return await billService.BillItemDelete(billId, deleteid, user);
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error?.response?.data?.error || 'Something Went Wrong');
    },
  });

  const DeleteInvoiceItem = useMutation({
    mutationFn: async (deleteid: number | undefined | string) => {
      const invoiceService = new InvoiceService();
      return await invoiceService.InvoiceItemDelete(invoiceId, deleteid, user);
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error?.response?.data?.error || 'Something Went Wrong');
    },
  });

  const editColumn = useMemo(
    () => (
      <Column
        width={100}
        allowReordering={false}
        allowFixing={false}
        alignment={'center'}
        allowSorting={false}
        dataField="Edit"
        cellRender={({
          data,
        }: {
          data: (typeof content)[number];
        }): JSX.Element => {
          return (
            <div
              onClick={() => {
                if (isModal && handleModal) {
                  setData && setData(data);
                  handleModal();
                } else {
                  router.push(`${url}/${data.id}`);
                }
              }}
              style={{ cursor: 'pointer' }}
            >
              {' '}
              ✏️{' '}
            </div>
          );
        }}
      />
    ),
    [router, url],
  );
  const detailColumn = useMemo(
    () => (
      <Column
        width={100}
        allowReordering={false}
        alignment={'center'}
        dataField="Detail"
        allowSorting={false}
        cellRender={({
          data,
        }: {
          data: (typeof content)[number];
        }): JSX.Element => {
          return (
            <div
              onClick={() => {
                router.push(`${url}/details/${data.id}`);
              }}
              style={{ cursor: 'pointer' }}
            >
              📜
            </div>
          );
        }}
      />
    ),
    [router, url],
  );

  const imageColumn = useMemo(
    () => (
      <Column
        allowReordering={false}
        alignment={'center'}
        allowSorting={false}
        allowEditing={false}
        dataField="Image"
        cellRender={({
          data,
        }: {
          data: (typeof content)[number];
        }): JSX.Element => {
          return (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Image
                fetchPriority="high"
                alt={'Product Image'}
                src={data?.image || NO_IMAGE}
                width={150}
                height={100}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                  overflow: 'hidden',
                }}
              />
            </div>
          );
        }}
      />
    ),
    [],
  );
  const downloadColumn = useMemo(
    () => (
      <Column
        width={100}
        allowReordering={false}
        alignment={'center'}
        allowSorting={false}
        dataField="Download"
        cellRender={({
          data,
        }: {
          data: (typeof content)[number];
        }): JSX.Element => {
          return (
            <div>
              <div
                onClick={() => {
                  downloadID(data.id);
                }}
                style={{ cursor: 'pointer' }}
              >
                {!downloadLoading || selectedDownloadId !== data.id ? (
                  <>📥 </>
                ) : (
                  <CircularProgress size={18} />
                )}
              </div>
            </div>
          );
        }}
      />
    ),
    [downloadID, downloadLoading],
  );
  const mapColumn = useMemo(
    () => (
      <Column
        width={100}
        allowReordering={false}
        allowSorting={false}
        alignment={'center'}
        dataField="Mapping"
        cellRender={({
          data,
        }: {
          data: (typeof content)[number];
        }): JSX.Element => {
          return (
            <div
              onClick={() => {
                router.push(`${url}/mapping/${data.id}`);
              }}
              style={{ cursor: 'pointer' }}
            >
              📜
            </div>
          );
        }}
      />
    ),
    [router, url],
  );
  const deleteColumn = useMemo(
    () => (
      <Column
        width={100}
        allowReordering={false}
        allowSorting={false}
        dataField="Delete"
        alignment={'center'}
        cellRender={({
          data,
        }: {
          data: (typeof content)[number];
        }): JSX.Element => {
          return (
            <div
              onClick={() => handleOpen(data.id)}
              style={{ cursor: 'pointer' }}
            >
              ❌
            </div>
          );
        }}
      />
    ),
    [deleteFunction, setID],
  );
  return (
    <Card sx={{ backgroundColor: '#f9fafc', boxShadow: 'none' }}>
      <AppModal
        open={open}
        onClose={handleClose}
        handleDelete={handleDelete}
        text="Are you sure to delete this?"
        cancelBtn="Cancel"
        confirmBtn="Delete"
      />
      <DataGrid
        wordWrapEnabled={true}
        showBorders={true}
        onRowRemoving={e => {
          if (e.data?.customer_product_id) {
            DeleteInvoiceItem.mutate(e.data?.id);
          } else {
            DeleteBillItem.mutate(e.data?.id);
          }
        }}
        dataSource={content}
        hoverStateEnabled={true}
        allowColumnReordering={true}
        rowAlternationEnabled={true}
        loadPanel={{
          enabled: false,
        }}
        onSelectionChanged={({ selectedRowsData }) => {
          if (onSelection) {
            onSelection(selectedRowsData);
          }
        }}
      >
        {editable ? (
          <Editing
            allowUpdating={true}
            allowDeleting={true}
            confirmDelete={false}
            mode="cell"
          />
        ) : null}
        {selection && <Selection mode={'multiple'} allowSelectAll />}
        {columns.map((item, index) => (
          <Column
            allowFixing={false}
            allowReordering={false}
            allowSorting={false}
            alignment={'center'}
            allowEditing={
              item.dataField === 'code' || item.dataField === 'product_name'
                ? false
                : true
            }
            {...item}
            key={index}
          />
        ))}
        {downloadCol ? downloadColumn : null}
        {imgCol ? imageColumn : null}
        {detailCol ? detailColumn : null}
        {mapCol ? mapColumn : null}
        {editCol ? editColumn : null}
        {deleteCol ? deleteColumn : null}
      </DataGrid>
    </Card>
  );
};

export const List = memo(ListComponent);
