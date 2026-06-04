/* eslint-disable @typescript-eslint/no-explicit-any */
import { EmailAuthProvider, getAuth, reauthenticateWithCredential, updatePassword } from 'firebase/auth'
import { useTheme } from '../../../hooks/useTheme'
import { useState } from 'react'
import { useToast } from '../../../hooks/useToast'
import { lightColors } from '../../../components/constants/colors';
import { LockKeyhole, ShieldCheck } from 'lucide-react';
import AppInput from '../../../components/common/AppInput';
import AppButton from '../../../components/common/AppButton';
import { useNavigate } from 'react-router-dom';
import AppBreadcrumb from '../../../components/common/AppBreadcrumb';

export default function ChangePasswordPage () {

  const auth = getAuth();
  const { theme } = useTheme();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const showError = (message: string) => {
    showToast(message, 'error')
  }

  const showSuccess = (message: string) => {
    showToast(message, 'success')
  }

  const handleChangePassword = async () => {

    if (!currentPassword || !newPassword || !confirmPassword) {
      showError('Fill all fields')
      return
    }

    if (newPassword !== confirmPassword) {
      showError('Passwords do not match')
      return
    }

    try {
      setLoading(true);

      const user = auth.currentUser;

      if (!user || !user.email) {
        showError('User not found')
        return;
      }

      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );

      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      navigate(-1);
      showSuccess('Password updated successfully');


    } catch (error: any) {
      console.log(error)

      if (error.code === 'auth/wrong-password') {
        showError('Incorrect password')
      } else if (error.code === 'auth/weak-password') {
        showError('Password should be atleast 6 characters')
      } else {
        showError('Something went wrong')
      }
    } finally {
      setLoading(false)
    }
  }

  return (

    <div>
      <AppBreadcrumb
        items={[
          {
            label: "Settings",
            path: "/settings"
          },
          {
            label: "Change Password"
          }
        ]}
      />
      {/* HEADER */}
      <div className="flex items-center gap-4 mb-8">

        <div>
          <h1 className="text-4xl font-bold" style={{ color: theme.text }}>
            Change Password
          </h1>

          <p className="mt-2" style={{ color: theme.subText }}>
            Update your admin account password
          </p>
        </div>
      </div>

      {/* CARD */}
      <div
        className='max-w-3xl rounded-[32px] border p-8'
        style={{
          backgroundColor: theme.card || lightColors.card,
          borderColor: theme.border || lightColors.border
        }}
      >
        {/* TOP */}
        <div className='flex items-center gap-4 mb-8'>
          <div
            className='w-16 h-16 rounded-2xl flex items-center justify-center'
            style={{
              backgroundColor: theme.highlight
            }}
          >
            <ShieldCheck size={30} color={theme.primary} />
          </div>

          <div>
            <h2 className='text-2xl font-bold'
              style={{ color: theme.text }}
            >
              Create New Password
            </h2>

            <p className='mt-1'
              style={{ color: theme.subText }}
            >
              Keep your admin account secure by updating passwords regularly.
            </p>
          </div>
        </div>

        {/* CURRENT PASSWORD */}
        <div className='mb-5'>
          <p
            className='mb-2 font-medium'
            style={{ color: theme.text }}
          >
            Current Password
          </p>

          <AppInput
            type='password'
            placeholder='Enter current password'
            value={currentPassword}
            onChange={(e: any) => setCurrentPassword(e.target.value)}
            icon={<LockKeyhole size={18} />}
          />
        </div>

        {/* NEW PASSWORD */}
        <div className='mb-5'>
          <p
            className='mb-2 font-medium'
            style={{ color: theme.text}}
          >
            New Password
          </p>

          <AppInput
            type='password'
            placeholder='Enter new password'
            value={newPassword}
            onChange={(e: any) => setNewPassword(e.target.value)}
            icon={<LockKeyhole size={18} />}
          />
        </div>

        {/* CONFIRM */}
        <div className='mb-7'>
          <p
            className='mb-2 font-medium'
            style={{
              color: theme.text
            }}
          >
            Confirm Password
          </p>

          <AppInput
            type='password'
            placeholder='Confirm password'
            value={confirmPassword}
            onChange={(e: any) => setConfirmPassword(e.target.value)}
            icon={<LockKeyhole size={18} />}
          />
        </div>

        {/* BUTTON */}
        <AppButton
          title={loading ? 'Updating...' : 'Change Password'}
          onClick={handleChangePassword}
          loading={loading}
        />
      </div>

    </div>
  );
}
