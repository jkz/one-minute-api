require 'upsert/active_record_upsert'

class Match < ActiveRecord::Base
  validates :user_1_id, presence: true
  validates :user_2_id, presence: true

  validate :not_self_swipe
  validate :user_id_order

  belongs_to :user_1, class: User
  belongs_to :user_2, class: User

  scope :mutual, -> { where(user_1_like: true, user_2_like: true) }

  def mutual
    user_1_like and user_2_like
  end

  def other_than(user)
    if user == self.user_1
      self.user_2
    elsif user == self.user_2
      self.user_1
    else
      nil
    end
  end

  def self.users_params(user_1, user_2)
    ids = [user_1.try(:id) || user_1, user_2.try(:id) || user_2].sort

    {
      user_1_id: ids[0],
      user_2_id: ids[1]
    }
  end

  def self.of_user(user)
    where("? in (matches.user_1_id, matches.user_2_id)", user.id)
  end

  def self.swipe(subject, object, verdict)
    match = Match.where(users_params(subject, object)).first_or_create

    if match.user_1 == subject
      swiper = :user_1_like
    else
      swiper = :user_2_like
    end

    # TODO upsert somehow includes verdict as match identifier
    # upsert users, {swiper => verdict}
    match.update({swiper => verdict})
  end

  private

  def not_self_swipe
    return unless user_1 == user_2
    errors.add(:user_id_1, "Can't swipe self")
    errors.add(:user_id_2, "Can't swipe self")
  end

  def user_id_order
    return if user_1_id < user_2_id
    errors.add(:user_id_1, "Ids need to be ordered")
    errors.add(:user_id_2, "Ids need to be ordered")
  end
end
