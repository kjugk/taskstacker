class Api::UsersController < ApplicationController
  skip_before_action :verify_authenticity_token

  def verify
    response.set_header('Cache-Control', 'no-store')

    if current_user
      render json: {
        user: {
          name: current_user.name,
          imageUrl: current_user.image_url
        }
      }
    else
      head 400
    end
  end
end