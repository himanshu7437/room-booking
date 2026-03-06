import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "../ui/Modal";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { FileInput } from "../ui/FileInput";
import { eventFormSchema } from "../../validations/schemas";
import { eventsApi } from "../../lib/api";
import { showSuccessToast, showErrorToast } from "../../utils/toast";

export default function EventFormModal({ event, onClose, onSuccess }) {
  const [vlogType, setVlogType] = useState(event?.vlogType || "youtube");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(eventFormSchema),
    defaultValues: event || {
      title: "",
      description: "",
      eventDate: "",
      vlogType: "youtube",
      vlogUrl: "",
    },
  });

  const handleFormSubmit = async (formData) => {
    try {
      const submitData = new FormData();
      submitData.append("title", formData.title);
      submitData.append("description", formData.description);
      submitData.append("eventDate", formData.eventDate);
      submitData.append("vlogType", vlogType);

      if (vlogType === "youtube") {
        submitData.append("vlogUrl", formData.vlogUrl);
      } else if (formData.eventVideo && formData.eventVideo.length > 0) {
        submitData.append("eventVideo", formData.eventVideo[0]);
      }

      // Handle event images
      if (formData.eventImages && formData.eventImages.length > 0) {
        for (let i = 0; i < formData.eventImages.length; i++) {
          submitData.append("eventImages", formData.eventImages[i]);
        }
      }

      if (event?._id) {
        await eventsApi.update(event._id, submitData);
        showSuccessToast("Event updated successfully!");
      } else {
        await eventsApi.create(submitData);
        showSuccessToast("Event created successfully!");
      }

      reset();
      onSuccess();
    } catch (error) {
      showErrorToast(error.response?.data?.message || "Failed to save event");
      console.error(error);
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={event ? "Edit Event" : "Create Event"}
      size="lg"
    >
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="space-y-4 max-h-96 overflow-y-auto"
      >
        <Input
          label="Event Title"
          placeholder="Hotel Gala Night"
          error={errors.title?.message}
          {...register("title")}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            placeholder="Event description..."
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
          label="Event Date"
          type="date"
          error={errors.eventDate?.message}
          {...register("eventDate")}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Video Source
          </label>
          <div className="flex gap-4 mb-3">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="youtube"
                checked={vlogType === "youtube"}
                onChange={(e) => setVlogType(e.target.value)}
              />
              <span className="text-sm">YouTube URL</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="upload"
                checked={vlogType === "upload"}
                onChange={(e) => setVlogType(e.target.value)}
              />
              <span className="text-sm">Upload Video</span>
            </label>
          </div>

          {vlogType === "youtube" ? (
            <Input
              label="YouTube URL"
              placeholder="https://youtube.com/watch?v=..."
              error={errors.vlogUrl?.message}
              {...register("vlogUrl")}
            />
          ) : (
            <FileInput
              label="Event Video"
              accept="video/*"
              error={errors.eventVideo?.message}
              {...register("eventVideo")}
            />
          )}
        </div>

        <FileInput
          label="Event Images"
          accept="image/*"
          multiple={true}
          error={errors.eventImages?.message}
          {...register("eventImages")}
        />

        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            variant="primary"
            className="flex-1"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Saving..."
              : event
                ? "Update Event"
                : "Create Event"}
          </Button>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
}
