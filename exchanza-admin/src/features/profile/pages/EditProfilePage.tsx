/* eslint-disable @typescript-eslint/no-explicit-any */
import { getAuth } from 'firebase/auth'
import { useTheme } from '../../../hooks/useTheme'
import { useEffect, useState } from 'react'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../../../services/firebase/firebase'
import { useToast } from '../../../hooks/useToast';
import Loader from '../../../components/common/Loader';
import { lightColors } from '../../../components/constants/colors';
import { Camera, Plus, X } from 'lucide-react';
import AppInput from '../../../components/common/AppInput';
import AppButton from '../../../components/common/AppButton';
import { uploadToCloudinary } from '../../../services/cloudinary/uploadToCloudinary';
import { useNavigate } from 'react-router-dom';
import AppBreadcrumb from '../../../components/common/AppBreadcrumb';

export default function EditProfilePage () {

  const auth = getAuth();

  const { theme } = useTheme();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [imageFile, setImageFile] = useState<File | null>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');

  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');

  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const uid = auth.currentUser?.uid
        if (!uid) return

        const ref = doc(db, 'users', uid)
        const snap = await getDoc(ref)

        if (snap.exists()) {
          const data = snap.data()

          setName(data.name || '')
          setEmail(data.email || '')
          setBio(data.bio || '')
          setSkills(data.skills || [])
          setImage(data.profileImage || null)
        }
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }
    fetchAdmin()
  }, []);

  
  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);

    const preview = URL.createObjectURL(file);
    setImage(preview);
  };

  const addSkill = () => {
    if (!skillInput.trim()) return;

    if (!skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()])
    }

    setSkillInput('')
  }

  const removeSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill))
  }

  const handleUpdate = async () => {
    try {
      setSaving(true)

      const uid = auth.currentUser?.uid
      if (!uid) return

      let imageUrl = image

      if (imageFile) {
        imageUrl = await uploadToCloudinary(imageFile);
      }

      await setDoc(doc(db, 'users', uid),
        {
          name,
          email,
          bio,
          skills,
          profileImage: imageUrl,
        },{
          merge: true
        }
      );

      showToast("Profile Update", "success");
      navigate(-1);
      
    } catch (error) {
        console.log(error)
        showToast("Update Failed", "error");
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <Loader fullScreen />
  }

  return (
    <div>
      <AppBreadcrumb
          items={[
          {
            label: "Profile",
              path: "/profile"
          },
          {
              label: "Edit Profile"
          }
          ]}
      />
      {/* HEADER */}
      <div className='mb-8'>
        <h1
          className='text-4xl font-bold'
          style={{ color: theme.text}}
        >
          Edit Profile
        </h1>

        <p
          className='mt-2'
          style={{
            color: theme.subText
          }}
        >
          Update your admin profile details
        </p>
      </div>

      {/* CARD */}
      <div
        className='rounded-[32px] p-8 border max-w-4xl'
        style={{
          backgroundColor: theme.card || lightColors.card,

          borderColor: theme.border || lightColors.border
        }}
      >
        {/* IMAGE */}
        <div className='flex justify-center mb-8'>
          <div className='relative'>
            <img
              src={image || 'https://i.pravatar.cc/300'}
              alt='profile'
              className='w-36 h-36 rounded-full object-cover border-[5px]'
              style={{
                borderColor: theme.primary
              }}
            />

            <label
              className='absolute bottom-1 right-2 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer'
              style={{
                backgroundColor: theme.primary
              }}
            >
              <Camera size={18} color='white' />

              <input
                type='file'
                hidden
                accept='image/*'
                onChange={handleImage}
              />
            </label>
          </div>
        </div>

        {/* NAME */}
        <div className='mb-5'>
          <p
            className='mb-2 font-medium'
            style={{
              color: theme.text
            }}
          >
            Name
          </p>

          <AppInput
            placeholder='Name'
            value={name}
            onChange={(e: any) => setName(e.target.value)}
          />
        </div>

        {/* EMAIL */}
        <div className='mb-5'>
          <p
            className='mb-2 font-medium'
            style={{
              color: theme.text
            }}
          >
            Email
          </p>

          <AppInput
            placeholder='Email'
            value={email}
            onChange={(e: any) => setEmail(e.target.value)}
          />
        </div>

        {/* BIO */}
        <div className='mb-5'>
          <p
            className='mb-2 font-medium'
            style={{
              color: theme.text
            }}
          >
            Bio
          </p>

          <textarea
            value={bio}
            onChange={e => setBio(e.target.value)}
            rows={5}
            placeholder='Write bio...'
            className='w-full rounded-2xl p-4 outline-none border'
            style={{
              backgroundColor: theme.background,

              borderColor: theme.border,

              color: theme.text
            }}
          />
        </div>

        {/* SKILLS */}
        <div className='mb-5'>
          <p
            className='mb-2 font-medium'
            style={{
              color: theme.text
            }}
          >
            Skills
          </p>

          <div className='flex gap-3'>
            <div className='flex-1'>
              <AppInput
                placeholder='Add skill'
                value={skillInput}
                onChange={(e: any) => setSkillInput(e.target.value)}
              />
            </div>

            <button
              onClick={addSkill}
              className='w-14 rounded-2xl flex items-center justify-center'
              style={{
                backgroundColor: theme.primary
              }}
            >
              <Plus size={20} color='white' />
            </button>
          </div>

          <div className='flex flex-wrap gap-3 mt-4'>
            {skills.map(skill => (
              <div
                key={skill}
                className='px-4 py-2 rounded-full flex items-center gap-2'
                style={{
                  backgroundColor: theme.tagBg
                }}
              >
                <span
                  style={{
                    color: theme.tagText
                  }}
                >
                  {skill}
                </span>

                <button onClick={() => removeSkill(skill)}>
                  <X size={14} color={theme.tagText} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* BUTTON */}
        <div className='mt-8'>
          <AppButton
            title={saving ? 'Updating...' : 'Save Changes'}
            onClick={handleUpdate}
            loading={saving}
          />
        </div>
      </div>

    </div>
  );
}
