Rails.application.routes.draw do

root to: 'finds#index'
resource :finds, only: [:create]

end
