import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "../ui/Modal";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { FileInput } from "../ui/FileInput";
import { roomFormSchema } from "../../validations/schemas";
import { roomsApi } from "../../lib/api";
import { showSuccessToast, showErrorToast } from "../../utils/toast";

export default function RoomFormModal({ room, onClose, onSuccess }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(roomFormSchema),
    defaultValues: room || {
      name: "",
      description: "",
      price: "",
      capacity: "1",
      amenities: "",
    },
  });

  const amenitiesValue = watch("amenities");

  const handleFormSubmit = async (formData) => {
    try {
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("description", formData.description);
      submitData.append("price", parseFloat(formData.price));
      submitData.append("capacity", parseInt(formData.capacity));

      // Handle amenities as JSON
      const amenities = formData.amenities
        .split(",")
        .map((a) => a.trim())
        .filter((a) => a.length > 0);
      submitData.append("amenities", JSON.stringify(amenities));

      // Handle file uploads
      if (formData.roomImages && formData.roomImages.length > 0) {
        for (let i = 0; i < formData.roomImages.length; i++) {
          submitData.append("roomImages", formData.roomImages[i]);
        }
      }

      if (room?._id) {
        await roomsApi.update(room._id, submitData);
        showSuccessToast("Room updated successfully!");
      } else {
        await roomsApi.create(submitData);
        showSuccessToast("Room created successfully!");
      }

      reset();
      onSuccess();
    } catch (error) {
      showErrorToast(error.response?.data?.message || "Failed to save room");
      console.error(error);
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={room ? "Edit Room" : "Create Room"}
      size="lg"
    >
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="space-y-4 max-h-96 overflow-y-auto"
      >
        <Input
          label="Room Name"
          placeholder="Deluxe Suite"
          error={errors.name?.message}
          {...register("name")}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            placeholder="Room description..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            rows={3}
            {...register("description")}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">
              {errors.description.message}
            </p>
          )}
        </div>

        <Input
          label="Price per Night ($)"
          type="number"
          placeholder="150"
          error={errors.price?.message}
          {...register("price")}
        />

        <Input
          label="Capacity (Guests)"
          type="number"
          placeholder="2"
          error={errors.capacity?.message}
          {...register("capacity")}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amenities (comma-separated)
          </label>
          <input
            type="text"
            placeholder="WiFi, TV, AC, Mini Bar"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            {...register("amenities")}
          />
          {errors.amenities && (
            <p className="mt-1 text-sm text-red-600">
              {errors.amenities.message}
            </p>
          )}
          {amenitiesValue && (
            <div className="mt-2 flex flex-wrap gap-2">
              {amenitiesValue
                .split(",")
                .map((a) => a.trim())
                .filter((a) => a.length > 0)
                .map((amenity, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded"
                  >
                    {amenity}
                  </span>
                ))}
            </div>
          )}
        </div>

        <FileInput
          label="Room Images"
          accept="image/*"
          multiple={true}
          error={errors.roomImages?.message}
          {...register("roomImages")}
        />

        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            variant="primary"
            className="flex-1"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : room ? "Update Room" : "Create Room"}
          </Button>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
}
