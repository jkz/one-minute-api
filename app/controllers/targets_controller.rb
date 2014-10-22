class TargetsController < ApplicationController
  before_action :authenticate_user!

  # Return a list of potential matches
  # Filtered by search preferences and proximity
  def index
    @targets = User.all
  end
end
