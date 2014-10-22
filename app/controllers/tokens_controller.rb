class TokensController < ApplicationController
  # Pass in a facebook token and return a user
  def create
    # TODO
    # Get facebook user data
    @user = User.first || User.create
    facebook_user_data = {}

    # Update user information in database
    @user.update! facebook_user_data

    # Return authentication token
    render json: {token: @user.authentication_token}
  end
end
