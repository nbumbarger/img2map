class MediaContentsController < ApplicationController
 
  def index
    @media_contents = Media.all
    respond_to do |format|
      format.html {render :index}
      format.json {render json: @media_contents.geoJSON}
    end
  end

  # Not surrently using this,
  # but might want to serve geoJSON from something other than the base_url
  def json
  end

  def create
    @media = Media.new(file: params[:file], lat: params[:lat], lng: params[:lng])
    if @media.save!
      respond_to do |format|
        format.json{ render :json => @media }
      end
    end
  end

  # I would rather use an AJAX delete method
  def delete_media
    Media.where(id: params[:media_contents]).destroy_all
    redirect_to root_url
  end

  def media_params
    params.permit(:file, :lat, :lng, "coords")
  end

end
