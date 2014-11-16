class ApplicationController < ActionController::Base
  protect_from_forgery with: :null_session

  attr_reader :current_user
  helper_method :current_user

  private

  def authenticate_user!
    @current_user = Token.authenticate(request.headers['Authorization'])
  end
end
