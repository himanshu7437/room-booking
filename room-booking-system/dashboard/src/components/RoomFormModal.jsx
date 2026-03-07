import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { X, Upload } from 'lucide-react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import api from '@/lib/api';

// Zod schema – added isActive
const roomSchema = z.object({
  name: z.string().min(3, 'Room name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  pricePerNight: z.coerce.number().min(0, 'Price must be positive'),
  capacity: z.coerce.number().int().min(1, 'Capacity must be at least 1'),
  amenities: z.string().optional(),
  isActive: z.boolean().default(true),
});

export function RoomFormModal({ isOpen, onClose, editingRoom, onSuccess }) {
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(roomSchema),
    defaultValues: editingRoom
      ? {
          name: editingRoom.name || '',
          description: editingRoom.description || '',
          pricePerNight: editingRoom.pricePerNight || '',
          capacity: editingRoom.capacity || 1,
          amenities: Array.isArray(editingRoom.amenities)
            ? editingRoom.amenities.join(', ')
            : editingRoom.amenities || '',
          isActive: editingRoom.isActive !== false, // default true if missing
        }
      : {
          name: '',
          description: '',
          pricePerNight: '',
          capacity: 1,
          amenities: '',
          isActive: true,
        },
  });

  const amenitiesValue = watch('amenities');

  useEffect(() => {
    if (isOpen) {
      if (editingRoom) {
        reset({
          name: editingRoom.name || '',
          description: editingRoom.description || '',
          pricePerNight: editingRoom.pricePerNight || '',
          capacity: editingRoom.capacity || 1,
          amenities: Array.isArray(editingRoom.amenities)
            ? editingRoom.amenities.join(', ')
            : editingRoom.amenities || '',
          isActive: editingRoom.isActive !== false,
        });
        setImagePreviews(editingRoom.images || []);
        setImageFiles([]); // new uploads only
      } else {
        reset({
          name: '',
          description: '',
          pricePerNight: '',
          capacity: 1,
          amenities: '',
          isActive: true,
        });
        setImagePreviews([]);
        setImageFiles([]);
      }
    }
  }, [isOpen, editingRoom, reset]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setImageFiles((prev) => [...prev, ...files]);

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const onSubmit = async (data) => {
  setIsSubmitting(true);

  try {
    const formData = new FormData();

    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('pricePerNight', Number(data.pricePerNight));
    formData.append('capacity', Number(data.capacity));
    formData.append('isActive', data.isActive); // keep your toggle

    // Amenities: append each as 'amenities' key (Express parses as array)
    const amenitiesArray = data.amenities
      .split(',')
      .map(a => a.trim())
      .filter(Boolean);
    
    amenitiesArray.forEach(amenity => {
      formData.append('amenities', amenity); // ← multiple 'amenities' keys
    });

    imageFiles.forEach(file => {
      formData.append('roomImages', file);
    });

    let response;
    if (editingRoom?._id) {
      response = await api.put(`/rooms/${editingRoom._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    } else {
      response = await api.post('/rooms', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }

    toast.success(editingRoom ? 'Room updated!' : 'Room created!');
    onSuccess();
    onClose();
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to save room');
    console.error('Submit error details:', error.response?.data || error);
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editingRoom ? 'Edit Room' : 'Add New Room'}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Name */}
        <Input
          label="Room Name"
          placeholder="e.g. Ocean View Deluxe"
          error={errors.name?.message}
          {...register('name')}
        />

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            {...register('description')}
            rows={4}
            placeholder="Describe the room features, view, size, bed types, etc..."
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition resize-none ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
        </div>

        {/* Price & Capacity */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Input
            label="Price per Night ($)"
            type="number"
            step="0.01"
            placeholder="150.00"
            error={errors.pricePerNight?.message}
            {...register('pricePerNight')}
          />

          <Input
            label="Maximum Guests"
            type="number"
            placeholder="2"
            error={errors.capacity?.message}
            {...register('capacity')}
          />
        </div>

        {/* Amenities */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amenities (comma separated)
          </label>
          <input
            {...register('amenities')}
            placeholder="WiFi, Air Conditioning, Mini Bar, TV, Ocean View..."
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition ${
              errors.amenities ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.amenities && <p className="mt-1 text-sm text-red-600">{errors.amenities.message}</p>}

          {amenitiesValue && (
            <div className="mt-3 flex flex-wrap gap-2">
              {amenitiesValue
                .split(',')
                .map(a => a.trim())
                .filter(Boolean)
                .map((amenity, idx) => (
                  <span
                    key={idx}
                    className="inline-flex px-3 py-1 text-xs font-medium rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200"
                  >
                    {amenity}
                  </span>
                ))}
            </div>
          )}
        </div>

        {/* Active Toggle – NEW */}
        <div className="flex items-center gap-3 pt-2">
          <input
            type="checkbox"
            id="isActive"
            {...register('isActive')}
            className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          />
          <label htmlFor="isActive" className="text-sm font-medium text-gray-700 cursor-pointer">
            Room is Active (visible to public)
          </label>
        </div>

        {/* Images Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Room Images</label>

          <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl border-gray-300 bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-10 h-10 mb-3 text-gray-400" />
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag & drop
              </p>
              <p className="text-xs text-gray-500">PNG, JPG, WEBP (max 10MB per image)</p>
            </div>
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>

          {imagePreviews.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Selected Images ({imagePreviews.length})
              </p>
              <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-thin scrollbar-thumb-gray-300">
                {imagePreviews.map((preview, idx) => (
                  <div key={idx} className="relative w-28 h-28 flex-shrink-0 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                    <img src={preview} alt={`preview-${idx}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition shadow"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
            disabled={isSubmitting}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg transition-all"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" fill="none" />
                  <path fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z" />
                </svg>
                Saving...
              </div>
            ) : editingRoom ? (
              'Update Room'
            ) : (
              'Create Room'
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}