Rails.application.routes.draw do

  root 'images#index'

  resources :images, only: [:create, :json]
  get 'images/json'
  delete 'delete_images', to: "images#delete_images"
  
end
