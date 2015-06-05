class Media < ActiveRecord::Base
  mount_uploader :file, MediaUploader

  def self.geoJSON
    @geojson = Array.new
    self.all.each do |media|
    	@name = media.file.model["file"]
    	@img_url = media.file.url
      @lat, @lng = demoKludge(media.lat, media.lng)
      @geojson << {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [@lng, @lat]
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

  def self.demoKludge(lat, lng)
    if lat.nil? || lng.nil?
      lat = 38.87531944
      lng = 77.05006111
    end
    return [lat, -lng]
  end

end
