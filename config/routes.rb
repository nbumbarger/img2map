Rails.application.routes.draw do

  root 'media_contents#index'

  resources :media_contents, only: [:create]
  delete 'delete_media', to: "media_contents#delete_media"
  
end
