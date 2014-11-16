class TokensController < ApplicationController
  # Pass in a facebook token and return a user
  def create
    # TODO
    # Handle errors
    facebook_user_data = HTTParty.get(
      "https://graph.facebook.com/me",
      query: {
        access_token: params[:facebook_token]
      }
    )

    puts "FB DATA", facebook_user_data

    @status = :ok

    @user = User.where(facebook_id: facebook_user_data['id']).first_or_create do
      @status = :created
    end

    # Update user information in database
    # @user.update! facebook_user_data

    # Return authentication token
    render json: {token: @user.authentication_token}, status: @status
  end
end
