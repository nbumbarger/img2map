class Media < ActiveRecord::Base
  mount_uploader :file, MediaUploader

  def self.geoJSON
    @geojson = Array.new
    self.all.each do |media|
    	@name = media.file.model["file"]
    	@img_url = media.file.url
      @geojson << {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [media.lng, media.lat]
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
    content = String.new
    content += '<h2>'+name+'</h2>'
    content +='<img src="'+img_url+'" alt="'+name+'" />';
  end

end
