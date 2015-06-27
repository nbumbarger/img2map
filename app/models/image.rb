class Image < ActiveRecord::Base
  mount_uploader :file, ImageUploader

  def self.geoJSON
    @geojson = Array.new
    self.all.each do |image|
    	@name = image.file.model["file"]
    	@img_url = image.file.url
      @geojson << {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [image.lng, image.lat]
        },
        properties: {
          name: @name,
          image_url: @img_url,
          popup_html: popupHTML(@name, @img_url),
          :'marker-color' => '#f00'
        }
      }
    end
    return @geojson
  end

  def self.popupHTML(name, img_url)
    content = '<h2 class="truncate">'+name+'</h2><img src="'+img_url+'" alt="'+name+'" />'
  end

end
