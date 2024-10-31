import { AuthLoginForm } from 'components/ui/form/Login';
import { IAuthLoginForm } from 'interface/user';
import { useRouter } from 'next/router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { setUserDetails } from 'redux/slices/user.slice';
import { ROOT_URL } from 'routes';
import AuthService from 'services/login';

const Login = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const auth = new AuthService();

  const SignIn = useMutation({
    mutationFn: async (body: IAuthLoginForm) => await auth.HandleSignin(body),
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['login'] });

      if (!data.hasError) {
        dispatch(
          setUserDetails({
            id: data.data.id,
            email: data.data.email,
            key: data.data.token,
          }),
        );
        router.push(ROOT_URL);
        toast.success(data.message);
      } else {
        toast.error('Failed to sign in');
      }
    },
    onError: () => {
      toast.error('Enter Correct Email or Password');
    },
  });

  const handleLogin = async (values: IAuthLoginForm): Promise<void> => {
    SignIn.mutate(values);
  };
  return (
    <AuthLoginForm isLoading={SignIn.isPending} handleLogin={handleLogin} />
  );
};

export default Login;
