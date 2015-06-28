class ImageUploader < CarrierWave::Uploader::Base
	
  if Rails.env.production?
    include Cloudinary::CarrierWave
  end

  if Rails.env.development?
  	storage :file
    def store_dir
      "uploads/#{model.class.to_s.underscore}/#{mounted_as}/#{model.id}"
    end
  end

  def extension_white_list
    %w(jpg jpeg gif png)
  end

end