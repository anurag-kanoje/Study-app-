import { View, Text, StyleSheet } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const { signIn } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await signIn(data.email, data.password);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      
      <View style={styles.form}>
        <Label htmlFor="email">Email</Label>
        <Input
          {...register('email')}
          id="email"
          placeholder="Enter your email"
          error={errors.email?.message}
        />

        <Label htmlFor="password">Password</Label>
        <Input
          {...register('password')}
          id="password"
          placeholder="Enter your password"
          secureTextEntry
          error={errors.password?.message}
        />

        <Button onPress={handleSubmit(onSubmit)}>
          Login
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  form: {
    width: '100%',
  },
});
