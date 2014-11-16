Rails.application.routes.draw do
  resources :matches, only: [:index, :create]
  resources :tokens, only: [:create, :destroy]
  resources :targets, only: :index
  resources :users, only: [:show, :index] do
    collection do
      get :me
    end
  end
end
