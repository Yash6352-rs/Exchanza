/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from 'react'
import { useTheme } from '../../../hooks/useTheme'
import { createTag, deleteTag, subscribeToTags } from '../services/tagService'
import { useToast } from '../../../hooks/useToast'
import Loader from '../../../components/common/Loader'
import AppInput from '../../../components/common/AppInput'
import {
    Download,
  Hash,
  Plus,
  Search,
  Tag,
  Tags,
  Trash2,
  TrendingUp
} from 'lucide-react'
import AppDialog from '../../../components/common/AppDialog'
import EmptyState from '../../../components/common/EmptyState'
import InfoCard from '../../../components/common/InfoCard'
import { TbTagOff } from 'react-icons/tb'
import TagsFilterMenu from '../components/TagsFilterMenu'

export default function TagsPage () {
  const { theme } = useTheme()
  const { showToast } = useToast()

  const [loading, setLoading] = useState(true)
  const [tags, setTags] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [tagName, setTagName] = useState('')
  const [selectedTag, setSelectedTag] = useState<any>(null)
  const [dialogVisible, setDialogVisible] = useState(false)

  const [filterOpen, setFilterOpen] = useState(false)
  const [sortType, setSortType] = useState('highest')

  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    const unsubscribe = subscribeToTags(data => {
      setTags(data)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const filteredTags = useMemo(() => {
    let filtered = tags.filter(tag =>
      tag.name?.toLowerCase().includes(search.toLowerCase())
    )

    switch (sortType) {
      case 'highest':
        filtered = [...filtered].sort(
          (a, b) => (b.usageCount || 0) - (a.usageCount || 0)
        )
        break

      case 'lowest':
        filtered = [...filtered].sort(
          (a, b) => (a.usageCount || 0) - (b.usageCount || 0)
        )
        break

      case 'recent':
        filtered = [...filtered].sort(
          (a, b) => (b.createdAt || 0) - (a.createdAt || 0)
        )
        break

      case 'alphabetical':
        filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name))
        break
    }

    return filtered
  }, [tags, search, sortType])

  const totalTags = tags.length

  const unusedTags = tags.filter(tag => tag.usageCount === 0).length

  const topTag = [...tags].sort(
    (a, b) => (b.usageCount || 0) - (a.usageCount || 0)
  )[0]

  const handleCreateTag = async () => {
    if (!tagName.trim()) {
      return showToast('Enter tag name', 'warning')
    }

    try {
      await createTag(tagName)
      showToast('Tag created', 'success')

      setTagName('')
    } catch (error) {
      console.log(error)
      showToast('Faild to create tag', 'error')
    }
  }

  const handleDeleteTag = async () => {
    try {
      await deleteTag(selectedTag.id)
      showToast('Tag deleted', 'success')
      setDialogVisible(false)
    } catch (error) {
      console.log(error)
      showToast('Failed to delete tag', 'error')
    }
  }

  const handleExportCSV = async () => {
    try {
      setExporting(true)

      const headers = ['Tag Name', 'Usage Count', 'Created At']

      const rows = filteredTags.map(tag => [
        tag.name,
        tag.usageCount || 0,
        tag.createdAt ? new Date(tag.createdAt).toLocaleDateString() : '-'
      ])

      const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n')

      const blob = new Blob([csvContent], {
        type: 'text/csv;charset=utf-8;'
      })

      const url = window.URL.createObjectURL(blob)

      const link = document.createElement('a')

      link.href = url

      link.setAttribute('download', 'exchanza-tags-report.csv')

      document.body.appendChild(link)

      link.click()

      document.body.removeChild(link)

      showToast('CSV exported successfully', 'success')
    } catch (error) {
      console.log(error)

      showToast('Failed to export CSV', 'error')
    } finally {
      setExporting(false)
    }
  }

  if (loading) {
    return <Loader fullScreen />
  }

  return (
    <div className='space-y-8'>
      {/* Top Header */}
      <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5'>
        {/* Search */}
        <div className='w-full max-w-2xl'>
          <AppInput
            className='rounded-[100px]'
            placeholder='Search platform tags...'
            value={search}
            onChange={e => setSearch(e.target.value)}
            icon={<Search size={18} />}
          />
        </div>

        {/* Actions */}
        <div className='flex items-center gap-5 ml-auto'>
          {/* Create Tag */}
          <div className='flex items-center gap-3'>
            <div className='w-[240px]'>
              <AppInput
                className='rounded-[100px]'
                placeholder='Create new tag'
                value={tagName}
                onChange={e => setTagName(e.target.value)}
                icon={<Tag size={18} />}
              />
            </div>

            <button
              onClick={handleCreateTag}
              className='flex p-3 items-center justify-center rounded-[100px]'
              style={{
                backgroundColor: theme.primary,
                color: 'white'
              }}
            >
              <Plus size={20} />
              Create Tag
            </button>
          </div>
        </div>
      </div>

      {/* Heading */}
      <div className='flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5'>
        <div>
          <h1
            className='text-4xl font-black tracking-tight'
            style={{ color: theme.primary }}
          >
            Tags Management
          </h1>

          <p
            className='mt-2 text-base max-w-2xl'
            style={{ color: theme.subText }}
          >
            Organize platform tags, monitor usage activity, and manage tag
            visibility across the system.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className='grid grid-cols-1 xl:grid-cols-3 gap-5'>
        {/* Stats */}
        <InfoCard
          title='Total Tags'
          value={totalTags}
          description='Total Active Tags'
          color={theme.primary}
          icon={<Tags size={22} color={theme.primary} />}
        />
        <InfoCard
          title='Top Performing'
          value={topTag?.name || 'No Tags'}
          description={`${topTag?.usageCount || 0} total usage`}
          color={theme.purple}
          icon={<TrendingUp size={22} color={theme.purple} />}
        />
        <InfoCard
          title='Unused Tags'
          value={unusedTags}
          description='Recommended for cleanup'
          color={theme.red}
          icon={<TbTagOff size={22} color={theme.red} />}
        />
      </div>

      {/* Table */}
      <div
        className='rounded-[34px] overflow-hidden'
        style={{
          backgroundColor: theme.card,
          border: `1px solid ${theme.border}`,
          boxShadow:
            theme.background === '#0B0F10'
              ? '0 10px 30px rgba(0,0,0,0.35)'
              : '0 10px 30px rgba(0,0,0,0.04)'
        }}
      >
        {/* Table Header */}
        <div
          className='flex items-center justify-between px-8 py-6'
          style={{
            backgroundColor: theme.background,
            borderBottom: `1px solid ${theme.border}`
          }}
        >
          <h2 className='text-2xl font-black' style={{ color: theme.primary }}>
            Platform Tags
          </h2>

          <div className='flex items-center gap-4'>
            <TagsFilterMenu
              filterOpen={filterOpen}
              setFilterOpen={setFilterOpen}
              sortType={sortType}
              setSortType={setSortType}
              theme={theme}
            />

            <button
              onClick={handleExportCSV}
              disabled={exporting}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
              style={{
                backgroundColor: theme.card,
                border: `1px solid ${theme.border}`,
                color: theme.subText,
                opacity: exporting ? 0.7 : 1,
              }}
            >
              <Download size={16} />
              {exporting ? "Exporting" : "Export CSV"}
            </button>

          </div>
        </div>

        {/* Table */}
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead
              style={{
                backgroundColor: theme.background
              }}
            >
              <tr>
                <th
                  className='text-left px-8 py-6 text-xs uppercase tracking-[0.18em]'
                  style={{ color: theme.subText }}
                >
                  Tag Name
                </th>

                <th
                  className='text-left px-8 py-6 text-xs uppercase tracking-[0.18em]'
                  style={{ color: theme.subText }}
                >
                  Usage Count
                </th>

                <th
                  className='text-right px-8 py-6 text-xs uppercase tracking-[0.18em]'
                  style={{ color: theme.subText }}
                >
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredTags.length > 0 ? (
                filteredTags.map(tag => (
                  <tr
                    key={tag.id}
                    className='group transition-all'
                    style={{
                      borderTop: `1px solid ${theme.border}`
                    }}
                  >
                    {/* Tag */}
                    <td className='px-8 py-6'>
                      <div className='flex items-center gap-4'>
                        <div
                          className='w-12 h-12 rounded-2xl flex items-center justify-center'
                          style={{
                            backgroundColor: theme.highlight
                          }}
                        >
                          <Hash size={18} color={theme.primary} />
                        </div>

                        <div>
                          <p
                            className='font-bold text-[15px]'
                            style={{
                              color: theme.text
                            }}
                          >
                            #{tag.name}
                          </p>

                          <p
                            className='text-sm'
                            style={{
                              color: theme.subText
                            }}
                          >
                            Platform tag
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Usage */}
                    <td className='px-8 py-6'>
                      <div className='flex items-center gap-2'>
                        <span
                          className='font-bold'
                          style={{
                            color: theme.primary
                          }}
                        >
                          {tag.usageCount || 0}
                        </span>

                        <span
                          className='text-xs'
                          style={{
                            color: theme.subText
                          }}
                        >
                          Total
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className='px-8 py-6'>
                      <div className='flex justify-end'>
                        <button
                          onClick={() => {
                            setSelectedTag(tag)
                            setDialogVisible(true)
                          }}
                          className='w-11 h-11 rounded-2xl flex items-center justify-center transition-all hover:scale-105'
                          style={{
                            backgroundColor: theme.background
                          }}
                        >
                          <Trash2 size={18} color={theme.error} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className='py-20'>
                    <EmptyState
                      title='No tags found'
                      description='Try searching with another keyword'
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        {filteredTags.length > 0 && (
          <div
            className='flex items-center justify-between px-8 py-5'
            style={{
              borderTop: `1px solid ${theme.border}`,
              backgroundColor: theme.background
            }}
          >
            <p className='text-sm' style={{ color: theme.subText }}>
              Showing{' '}
              <span className='font-bold' style={{ color: theme.text }}>
                {filteredTags.length}
              </span>{' '}
              tags
            </p>
          </div>
        )}
      </div>

      <div className='h-8' />

      {/* Delete Dialog */}
      <AppDialog
        visible={dialogVisible}
        title='Delete Tag'
        description='Are you sure you want to delete this tag?'
        onCancel={() => setDialogVisible(false)}
        onConfirm={handleDeleteTag}
      />
    </div>
  )
}
