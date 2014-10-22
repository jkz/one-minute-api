class Match < ActiveRecord::Base
  validates :user_1_id, presence: true
  validates :user_2_id, presence: true

  has_one :user_1, class: User
  has_one :user_2, class: User

  scope :matches { where(user_1_like: true, user_2_like: true) }

  def self.swipe(subject, object, verdict)
    users = {
      user_1_id: [subject, object].max
      user_2_id: [subject, object].min
    }

    if subject == users[:user_1_id]
      swiper = :user_1_like
    else
      swiper = :user_2_like
    end

    upsert users, {swiper => verdict}
  end
end
