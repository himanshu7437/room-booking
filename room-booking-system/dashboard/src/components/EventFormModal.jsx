import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { X, Upload, Video } from 'lucide-react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import api from '@/lib/api';

const eventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  eventDate: z.string().min(1, 'Event Date is required'),
  amenities: z.string().optional(),
  vlogType: z.enum(['none', 'youtube', 'upload']),
  vlogUrl: z.string().optional(),
  isPublished: z.boolean().default(false)
});

export function EventFormModal({ isOpen, onClose, editingEvent, onSuccess }) {
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [videoFile, setVideoFile] = useState(null);

  const { register, handleSubmit, reset, watch, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: '',
      description: '',
      eventDate: '',
      amenities: '',
      vlogType: 'none',
      vlogUrl: '',
      isPublished: false
    }
  });

  const vlogTypeVal = watch('vlogType');

  useEffect(() => {
    if (editingEvent) {
      reset({
        title: editingEvent.title,
        description: editingEvent.description,
        eventDate: editingEvent.eventDate ? new Date(editingEvent.eventDate).toISOString().split('T')[0] : '',
        amenities: Array.isArray(editingEvent.amenities) ? editingEvent.amenities.join(', ') : editingEvent.amenities || '',
        vlogType: editingEvent.vlogType || 'none',
        vlogUrl: editingEvent.vlogUrl || '',
        isPublished: editingEvent.isPublished || false
      });
      setImagePreviews(editingEvent.images || []);
    } else {
      reset({
        title: '', description: '', eventDate: '', amenities: '', vlogType: 'none', vlogUrl: '', isPublished: false
      });
      setImages([]);
      setImagePreviews([]);
      setVideoFile(null);
    }
  }, [editingEvent, reset, isOpen]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(prev => [...prev, ...files]);

    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
    }
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('eventDate', data.eventDate);
      formData.append('isPublished', data.isPublished);
      formData.append('vlogType', data.vlogType);

      if (data.vlogType === 'youtube') {
        formData.append('vlogUrl', data.vlogUrl);
      } else if (data.vlogType === 'upload' && videoFile) {
        formData.append('eventVideo', videoFile);
      }

      if (data.amenities) {
        const amenitiesArr = data.amenities.split(',').map(a => a.trim()).filter(Boolean);
        amenitiesArr.forEach(amenity => {
          formData.append('amenities', amenity);
        });
      }

      images.forEach(img => {
        formData.append('eventImages', img);
      });

      if (editingEvent) {
        await api.put(`/events/${editingEvent._id}`, formData);
        toast.success('Event updated successfully');
      } else {
        await api.post('/events', formData);
        toast.success('Event created successfully');
      }
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(editingEvent ? 'Failed to update event' : 'Failed to create event');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editingEvent ? 'Edit Event' : 'Create New Event'}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="Event Title" {...register('title')} error={errors.title?.message} />
        
        <div className="flex flex-col space-y-1.5 w-full">
          <label className="text-sm font-medium text-gray-700">Description</label>
          <textarea
            {...register('description')}
            className={`flex min-h-[80px] w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.description ? 'border-red-500' : ''}`}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input label="Date" type="date" {...register('eventDate')} error={errors.eventDate?.message} />
          <Input label="Amenities (Optional)" placeholder="e.g. DJ, Drinks..." {...register('amenities')} />
        </div>

        {/* Vlog Section */}
        <div className="space-y-2 border-t pt-4">
          <label className="text-sm font-medium text-gray-700 block">Event Vlog / Video</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input type="radio" value="none" {...register('vlogType')} /> None
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input type="radio" value="youtube" {...register('vlogType')} /> YouTube URL
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input type="radio" value="upload" {...register('vlogType')} /> Upload Video
            </label>
          </div>

          {vlogTypeVal === 'youtube' && (
            <Input placeholder="https://youtube.com/watch?v=..." {...register('vlogUrl')} />
          )}

          {vlogTypeVal === 'upload' && (
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer hover:bg-gray-50">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Video className="w-6 h-6 mb-2 text-gray-500" />
                  <p className="text-sm text-gray-500">{videoFile ? videoFile.name : 'Select video to upload'}</p>
                </div>
                <input type="file" className="hidden" accept="video/*" onChange={handleVideoChange} />
              </label>
            </div>
          )}
        </div>

        {/* Images section */}
        <div className="space-y-2 border-t pt-4">
          <label className="text-sm font-medium text-gray-700">Event Gallery</label>
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer hover:bg-gray-50">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-6 h-6 mb-2 text-gray-500" />
                <p className="text-sm text-gray-500">Upload Images</p>
              </div>
              <input type="file" className="hidden" multiple accept="image/*" onChange={handleImageChange} />
            </label>
          </div>
          
          {imagePreviews.length > 0 && (
            <div className="flex gap-2 mt-4 overflow-x-auto py-2">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative w-24 h-24 shrink-0 rounded-lg overflow-hidden border border-gray-200">
                  <img src={preview} alt="preview" className="object-cover w-full h-full" />
                  <button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow-sm"><X className="w-3 h-3" /></button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 pt-4">
          <input type="checkbox" id="isPublished" {...register('isPublished')} className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500" />
          <label htmlFor="isPublished" className="text-sm font-medium text-gray-700">Publish Event to Public</label>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t mt-6">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" isLoading={isSubmitting}>
            {editingEvent ? 'Save Changes' : 'Create Event'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
