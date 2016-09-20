Rails.application.routes.draw do

  root to: 'finds#index'
  resource :finds, only: [:create, :destroy]
  resources :character, only: [:index]


end
