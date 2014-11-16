class UsersController < ApplicationController
  before_action :authenticate_user!, only: :me

  def index
    @users = User.all
  end

  def show
    @user = User.find(params[:id])
  end

  def me
    @user = current_user

    render :show
  end
end
