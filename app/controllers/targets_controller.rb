class TargetsController < ApplicationController
  before_action :authenticate_user!

  # Return a list of potential matches
  # Filtered by search preferences and proximity
  def index
    # puts 'targets', current_user, current_user.id, User.all
    @targets = current_user.targets
    # @targets = User.all
  end
end
