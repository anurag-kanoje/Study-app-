import { View, Text, StyleSheet } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function Signup() {
  const { signUp } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    try {
      await signUp(data.email, data.password);
    } catch (error) {
      console.error('Signup error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      
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

        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          {...register('confirmPassword')}
          id="confirmPassword"
          placeholder="Confirm your password"
          secureTextEntry
          error={errors.confirmPassword?.message}
        />

        <Button onPress={handleSubmit(onSubmit)}>
          Sign Up
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
