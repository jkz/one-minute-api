Rails.application.routes.draw do
  resources :matches, only: [:index, :update]
  resources :tokens, only: [:create, :destroy]
  resources :targets, only: :index
end
