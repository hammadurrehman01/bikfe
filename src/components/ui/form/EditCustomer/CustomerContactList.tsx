import { AddCircle, RemoveCircle } from '@mui/icons-material';
import {
  Button,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
  Typography,
  tooltipClasses,
} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { AppModal, Input } from 'components';
import { ErrorResponse } from 'interface/ApiError';
import { TContact } from 'interface/customer';
import { E164Number } from 'libphonenumber-js/types.cjs';
import { useRouter } from 'next/router';
import { useState } from 'react';
import PhoneInput, {
  getCountries,
  getCountryCallingCode,
} from 'react-phone-number-input';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { RootState } from 'redux/store';
import CustomerService from 'services/customer';

interface Props {
  index: number;
  item: TContact;
  showButton?: boolean;
  formik: any;
}

const CustomerContactList = ({ item, index, showButton, formik }: Props) => {
  const router = useRouter();
  const pid: string | string[] | undefined = router.query.pid;
  const [countryCode, setCountryCode] = useState('1');
  const [countryInitial, setCountryInitial] = useState('US');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDisable, setIsDisable] = useState(true);
  const contacts = formik?.values?.customerPhoneNumbers;

  const customerService = new CustomerService();

  const [open, setOpen] = useState(false);
  const user = useSelector((state: RootState) => state.user);

  const [numberErrors, setNumberErrors] = useState<any>([]);

  const queryClient = useQueryClient();

  const DeleteCustomerPhone = useMutation({
    mutationFn: async (id: string | number | undefined) =>
      await customerService.CustomerPhoneDeleteAxios(pid, id, user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customerPhone'] });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error?.response?.data?.error || 'Something Went Wrong');
    },
  });

  const handleFormChange = (
    index: number,
    name: string,
    value: string | E164Number | undefined,
  ) => {
    const newList = contacts.map((i, idx) =>
      index === idx
        ? {
            ...i,
            [name]: value,
          }
        : i,
    );
    formik.setFieldValue('customerPhoneNumbers', newList);
  };

  const CreateCustomerPhone = useMutation({
    mutationFn: async (body: any) => {
      await customerService.CreateCustomerPhoneAxios(body, pid, user);
      return body;
    },
    onSuccess: data => {
      toast.success('Phone added');
      setIsSubmitting(false);
      queryClient.invalidateQueries({ queryKey: ['customerPhone'] });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error?.response?.data?.error || 'Something Went Wrong');
    },
  });

  const UpdateCustomerPhone = useMutation({
    mutationFn: async ({ body, id }: { body: any; id: string | number }) => {
      await customerService.UpdateCustomerPhoneAxios(body, pid, id, user);
      return body;
    },
    onSuccess: data => {
      toast.success('Phone Updated');
      setIsSubmitting(false);
      queryClient.invalidateQueries({ queryKey: ['customerPhone'] });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error?.response?.data?.error || 'Something Went Wrong');
      setIsSubmitting(false);
    },
  });

  const handleDeleteContact = (item: any, i: number) => {
    removeContact(item, i);
    if (item.id) DeleteCustomerPhone.mutate(item.id);
    setOpen(false);
  };

  const removeContact = (item: any, index: number) => {
    if (item.id) {
      setOpen(true);
      return;
    }
    if (contacts.length !== 1) {
      const filteredList = contacts.filter((i, idx) => idx !== index);
      formik.setFieldValue('customerPhoneNumbers', filteredList);
      const filter = numberErrors.filter((itm: number) => itm !== index);
      setNumberErrors(filter);
    }
  };

  const addContact = () => {
    const newObject = {
      number: '',
      contactPerson: '',
    };
    formik.setFieldValue('customerPhoneNumbers', [...contacts, newObject]);
  };

  const handleClose = () => setOpen(false);

  const handlePhoneSubmit = (item: any) => {
    {
      setIsSubmitting(true);
      if (item.id) {
        UpdateCustomerPhone.mutate({ body: item, id: item.id });
      } else {
        CreateCustomerPhone.mutate(item);
      }
    }
  };

  const handleChange = e => {
    if (e.target.value !== '') {
      setIsDisable(false);
    }
    if (e.target.value === '') {
      setIsDisable(true);
    }
    handleFormChange(index, 'contactPerson', e.target.value);
  };

  return (
    <Stack direction={'row'} sx={{ paddingTop: '1.8rem' }}>
      <AppModal
        open={open}
        onClose={handleClose}
        text="Are you sure you want to Delete this Contact?"
        cancelBtn="Cancel"
        confirmBtn="Delete"
        handleDelete={() => handleDeleteContact(item, index)}
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
          <IconButton onClick={addContact}>
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
              removeContact(item, index);
            }}
          >
            <RemoveCircle />
          </IconButton>
        </Tooltip>
      </Stack>
      <Stack sx={{ width: '100%' }}>
        <Stack
          sx={{
            height: '55px',
            border: '1px solid #E6E8F0',
            justifyContent: 'center',
            borderRadius: '4px',
            marginTop: '0.5rem',
            '.PhoneInput': {
              input: {
                height: '100%',
                border: 'none',
                fontSize: '1rem',
                outline: 'none',
                ':focus': { border: 'none' },
              },
            },
          }}
        >
          <PhoneInput
            value={item.number || `+${countryCode}`}
            limitMaxLength
            focusInputOnCountrySelection
            placeholder={`+${countryCode}`}
            onCountryChange={(e: any) => {
              if (e) {
                setCountryInitial(e);
                setCountryCode('');
              }
            }}
            countrySelectComponent={() => (
              <TextField
                autoComplete="off"
                size="small"
                select
                value={countryInitial}
                sx={{ fieldset: { border: 'none !important' } }}
                onChange={event => {
                  setCountryCode(
                    getCountryCallingCode(event.target.value as any),
                  );
                  setCountryInitial(event.target.value);
                  handleFormChange(index, 'number', event.target.value);
                }}
              >
                {getCountries().map(country => (
                  <MenuItem key={country} value={country}>
                    <Typography sx={{ width: '2rem' }}>{country}</Typography>
                  </MenuItem>
                ))}
              </TextField>
            )}
            onChange={e => {
              handleFormChange(index, 'number', e);
            }}
          />
        </Stack>
        <Input
          name="contactPerson"
          value={item.contactPerson}
          label={'Contact Person'}
          onChange={e => {
            handleChange(e);
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
              onClick={() => handlePhoneSubmit(item)}
              sx={{
                mx: 1,
                backgroundColor: `${isDisable ? '#bcbcbc' : '#5048e5'}`,
                color: 'white !important',
                '&:hover': {
                  color: 'white',
                  backgroundColor: '#5048e5',
                },
              }}
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

export default CustomerContactList;
