import { useEffect, useState } from 'react'
import { TriangleAlert, Mail } from 'lucide-react'
import { useTheme } from '../../../hooks/useTheme';
import { useToast } from '../../../hooks/useToast';
import { auth, db } from '../../../services/firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';
import AppBreadcrumb from '../../../components/common/AppBreadcrumb';

export default function AdminReportProblemPage () {

  const { theme } = useTheme();
  const { showToast } = useToast();

  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");

  useEffect(() => {

    const fetchAdmin = async () => {
        try {
            const uid = auth.currentUser?.uid;

            if (!uid) return;

            const ref = doc(db, "users", uid);
            const snap = await getDoc(ref);

            if (snap.exists()) {
                setAdminEmail(
                    snap.data().email || ""
                );
            }
        } catch (error) {
            console.log(error);
        }
    };
    fetchAdmin();

  }, []);

  const developerEmail = 'yashpanchal1422004@gmail.com'
 
  const handleSubmit = async () => {
    if (!subject.trim() || !description.trim()) {
      showToast("Please fill all fields", "error")
      return
    }

    try {
      setLoading(true)

      const mailSubject = encodeURIComponent(
        `[Exchanza Admin Report] ${subject}`
      )

      const mailBody = encodeURIComponent(
        `FROM: ${adminEmail}

        SUBJECT:
        ${subject}

        DESCRIPTION:
        ${description}

        -------------------------
        Generated from Exchanza Admin Panel`
      )

      window.location.href = `mailto:${developerEmail}?subject=${mailSubject}&body=${mailBody}`
      showToast("Report sent succesfully", "success");

    } catch (error) {
      console.log(error)
      showToast("Something went wrong", "error");

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
            label: "Report Problem"
          }
        ]}
      />
      {/* HEADER */}
      <div className='flex items-center gap-4 mb-8'>
        <div>
          <h1 className='text-4xl font-bold' style={{ color: theme.primary }}>
            Report Problem
          </h1>

          <p className='mt-2' style={{ color: theme.subText }}>
            Send issues, bugs, or admin problems directly to the developer.
          </p>
        </div>
      </div>

      {/* CARD */}
      <div
        className='max-w-3xl rounded-[32px] border p-8'
        style={{
          backgroundColor: theme.card,
          borderColor: theme.border
        }}
      >
        {/* TOP */}
        <div className='flex items-center gap-4 mb-8'>
          <div
            className='w-16 h-16 rounded-2xl flex items-center justify-center'
            style={{
              backgroundColor: `${theme.error}15`
            }}
          >
            <TriangleAlert size={32} color={theme.error} />
          </div>

          <div>
            <h2 className='text-2xl font-bold' style={{ color: theme.text }}>
              We’re Here To Help
            </h2>

            <p className='mt-1' style={{ color: theme.subText }}>
              Submit dashboard issues, analytics bugs, or platform-related
              problems.
            </p>
          </div>
        </div>

        {/* DEVELOPER EMAIL */}
        <div
          className='rounded-2xl border p-4 mb-6 flex items-center gap-5'
          style={{
            backgroundColor: theme.background,
            borderColor: theme.border
          }}
        >
          <Mail size={30} color={theme.primary} />

          <div>
            <p className='text-sm' style={{ color: theme.subText }}>
              Reports will be sent to
            </p>

            <p className='font-semibold' style={{ color: theme.text }}>
              {developerEmail}
            </p>
          </div>
        </div>

        <div
          className='rounded-2xl border p-4 mb-6 flex items-center gap-5'
          style={{
            backgroundColor: theme.background,
            borderColor: theme.border
          }}
        >
          <Mail size={30} color={theme.primary} />

          <div>
            <p className='text-sm' style={{ color: theme.subText }}>
              Your Email
            </p>

            <p className='font-semibold' style={{ color: theme.text }}>
              {adminEmail}
            </p>
          </div>
        </div>

        {/* SUBJECT */}
        <div className='mb-5'>
          <label
            className='block mb-2 font-semibold'
            style={{ color: theme.text }}
          >
            Subject
          </label>

          <input
            type='text'
            placeholder='Short summary of issue'
            value={subject}
            onChange={e => setSubject(e.target.value)}
            className='w-full px-5 py-4 rounded-2xl border outline-none'
            style={{
              backgroundColor: theme.background,
              borderColor: theme.border,
              color: theme.text
            }}
          />
        </div>

        {/* DESCRIPTION */}
        <div className='mb-8'>
          <label
            className='block mb-2 font-semibold'
            style={{ color: theme.text }}
          >
            Description
          </label>

          <textarea
            placeholder='Explain the issue in detail...'
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={8}
            className='w-full px-5 py-4 rounded-2xl border outline-none resize-none'
            style={{
              backgroundColor: theme.background,
              borderColor: theme.border,
              color: theme.text
            }}
          />
        </div>

        {/* BUTTON */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className='w-full py-4 rounded-2xl font-semibold transition-all hover:scale-[1.01]'
          style={{
            backgroundColor: theme.primary,
            color: 'white'
          }}
        >
          {loading ? 'Opening Mail...' : 'Send Report'}
        </button>
      </div>
    </div>
  )
}
