import { AddCircle, RemoveCircle } from '@mui/icons-material';
import {
  Autocomplete,
  Button,
  CircularProgress,
  IconButton,
  Stack,
  TextField,
  TextFieldProps,
  Tooltip,
  tooltipClasses,
} from '@mui/material';
import React, { useMemo, useState, ChangeEvent } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AppModal, Input } from 'components';
import { TAddress } from 'interface/customer';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import countryList from 'react-select-country-list';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import { ErrorResponse } from 'interface/ApiError';
import { RootState } from 'redux/store';
import CustomerService from 'services/customer';

interface Props {
  index: number;
  item: TAddress;
  showButton: boolean;
  formik: any;
}

const CustomerAddressList = ({ item, index, showButton, formik }: Props) => {
  const router = useRouter();
  const customerService = new CustomerService();
  const [isDisable, setIsDisable] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState<boolean>(false);
  const user = useSelector((state: RootState) => state.user);
  const queryClient = useQueryClient();
  const options = useMemo(() => countryList().getData(), []);
  const pid: string | string[] | undefined = router.query.pid;
  const handleClose = () => setOpen(false);
  const addresses = formik?.values?.customerAddresses;

  const addAddress = () => {
    const newObject = {
      address: '',
      country: '',
    };

    formik.setFieldValue('customerAddresses', [...addresses, newObject]);
  };

  const removeAddress = (item: any, index: number) => {
    if (item.id) {
      setOpen(true);
      return;
    }
    if (addresses.length !== 1) {
      const filteredList = addresses.filter((i, idx: number) => idx !== index);
      formik.setFieldValue('customerAddresses', filteredList);
    }
  };

  const CreateCustomerAddress = useMutation({
    mutationFn: async (body: any) => {
      await customerService.CreateCustomerAddressAxios(body, pid, user);
      return body;
    },
    onSuccess: data => {
      toast.success('Address Added');
      setIsSubmitting(false);
      queryClient.invalidateQueries({ queryKey: ['customerAddress'] });
    },
    onError: (error, variables) => {
      toast.error('Something Went Wrong');
    },
  });

  const UpdateCustomerAddress = useMutation({
    mutationFn: async ({ body, id }: { body: any; id: string | number }) => {
      await customerService.UpdateCustomerAddressAxios(body, pid, id, user);
      return body;
    },
    onSuccess: data => {
      toast.success('Address Updated');
      setIsSubmitting(false);
      queryClient.invalidateQueries({ queryKey: ['customerAddress'] });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error?.response?.data?.error || 'Something Went Wrong');
      setIsSubmitting(false);
    },
  });

  const DeleteCustomerAddress = useMutation({
    mutationFn: async (id: string | number | undefined) =>
      await customerService.CustomerAddressDeleteAxios(pid, id, user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customerAddress'] });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error?.response?.data?.error || 'Something Went Wrong');
    },
  });

  const handleFormAddress = (
    index: number,
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    formValue?: { label: string; value: string } | null,
    type?: string,
  ) => {
    const name = type || event.target.name;
    const value = formValue?.value ?? event.target.value;

    if (value !== '') {
      setIsDisable(false);
    } else {
      setIsDisable(true);
    }

    const newList = addresses.map((i, idx) =>
      index === idx
        ? {
            ...i,
            [name]: value ?? '',
          }
        : i,
    );

    formik.setFieldValue('customerAddresses', newList);
  };

  const handleDeleteAddress = (item: any, i: number) => {
    removeAddress(item, i);
    if (item.id) DeleteCustomerAddress.mutate(item.id);
    setOpen(false);
  };

  const handleAddressSubmit = (item: any) => {
    setIsSubmitting(true);
    if (item.id) {
      UpdateCustomerAddress.mutate({ body: item, id: item.id });
    } else {
      CreateCustomerAddress.mutate(item);
    }
  };

  return (
    <Stack direction={'row'} sx={{ paddingTop: '1rem' }}>
      <AppModal
        open={open}
        onClose={handleClose}
        text="Are you sure you want to Delete this Address?"
        cancelBtn="Cancel"
        confirmBtn="Delete"
        handleDelete={() => handleDeleteAddress(item, index)}
      />
      <Stack sx={{ alignItems: 'center', justifyContent: 'center' }}>
        <Tooltip
          placement="left"
          slotProps={{
            popper: {
              sx: {
                [`&.${tooltipClasses.popper}[data-popper-placement*="bottom"] .${tooltipClasses.tooltip}`]:
                  {
                    marginTop: '0px',
                  },
                [`&.${tooltipClasses.popper}[data-popper-placement*="top"] .${tooltipClasses.tooltip}`]:
                  {
                    marginBottom: '0px',
                  },
                [`&.${tooltipClasses.popper}[data-popper-placement*="right"] .${tooltipClasses.tooltip}`]:
                  {
                    marginLeft: '0px',
                  },
                [`&.${tooltipClasses.popper}[data-popper-placement*="left"] .${tooltipClasses.tooltip}`]:
                  {
                    marginRight: '-4px',
                  },
              },
            },
          }}
          title="Add"
        >
          <IconButton onClick={addAddress}>
            <AddCircle />
          </IconButton>
        </Tooltip>
        <Tooltip
          placement="left"
          title="Remove"
          slotProps={{
            popper: {
              sx: {
                [`&.${tooltipClasses.popper}[data-popper-placement*="bottom"] .${tooltipClasses.tooltip}`]:
                  {
                    marginTop: '0px',
                  },
                [`&.${tooltipClasses.popper}[data-popper-placement*="top"] .${tooltipClasses.tooltip}`]:
                  {
                    marginBottom: '0px',
                  },
                [`&.${tooltipClasses.popper}[data-popper-placement*="right"] .${tooltipClasses.tooltip}`]:
                  {
                    marginLeft: '0px',
                  },
                [`&.${tooltipClasses.popper}[data-popper-placement*="left"] .${tooltipClasses.tooltip}`]:
                  {
                    marginRight: '-4px',
                  },
              },
            },
          }}
        >
          <IconButton
            onClick={() => {
              removeAddress(item, index);
            }}
          >
            <RemoveCircle />
          </IconButton>
        </Tooltip>
      </Stack>
      <Stack sx={{ width: '100%' }}>
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          value={{
            label: addresses[index]?.country,
            value: addresses[index]?.country,
          }}
          onChange={(e: any, value) => {
            handleFormAddress(index, e, value, 'country');
          }}
          options={options.map(item => {
            return {
              label: item.label,
              value: item.label,
            };
          })}
          fullWidth
          sx={{ marginTop: '20px' }}
          renderInput={(params: TextFieldProps) => (
            <TextField {...params} label="Countries" />
          )}
        />
        <Input
          name="address"
          label={'address'}
          value={item.address}
          onChange={e => {
            handleFormAddress(index, e);
          }}
        />
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            marginTop: '10px',
          }}
        >
          {showButton && (
            <Button
              disabled={isDisable}
              sx={{
                mx: 1,
                backgroundColor: `${isDisable ? '#bcbcbc' : '#5048e5'}`,
                color: 'white !important',
                '&:hover': {
                  color: 'white',
                  backgroundColor: '#5048e5',
                },
              }}
              onClick={() => handleAddressSubmit(item)}
            >
              {isSubmitting ? (
                <CircularProgress size={20} sx={{ color: 'white' }} />
              ) : (
                'Save'
              )}
            </Button>
          )}
        </div>
      </Stack>
    </Stack>
  );
};

export default CustomerAddressList;
