class ImagesController < ApplicationController

  def index
    @images = Image.all
    respond_to do |format|
      format.html {render :index}
      format.json {render json: @images.geoJSON}
    end
  end

  def create
    @image = Image.new(file: params[:file], lat: params[:lat], lng: params[:lng])
    if @image.save!
      respond_to do |format|
        format.json{ render :json => @image }
      end
    end
  end

  # Plan to change to an AJAX delete method
  def delete_images
    Image.where(id: params[:images]).destroy_all
    redirect_to root_url
  end

  def image_params
    params.permit(:file, :lat, :lng, "coords")
  end

end
