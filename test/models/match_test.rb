require 'test_helper'

class MatchTest < ActiveSupport::TestCase
  def new_match(*args)
    Match.new({
      user_1_id: args[0],
      user_1_like: args[1],
      user_2_id: args[2],
      user_2_like: args[3],
    })
  end

  test "other_than" do
    match = Match.first

    assert_equal match.other_than(match.user_1), match.user_2
    assert_equal match.other_than(match.user_2), match.user_1
  end

  test "mutual" do
    assert_equal(Match.mutual.count, 3)
  end

  test "#mutual" do
    match = new_match(1, false, 2, false)

    assert_not match.mutual

    match.user_1_like = true

    assert_not match.mutual

    match.user_2_like = true

    assert match.mutual
  end

  test "swipe" do
    user_1 = user.find(5)
    user_2 = user.find(6)

    Match.swipe(user_1, user_2, true)
    match = Match.find_by({user_1_id: 5, user_2_id: 6})

    assert match
    assert_not match.mutual

    Match.swipe(user_2, user_1, true)
    match.reload

    assert match.mutual
  end

  test "not_self_swipe" do
    assert_raises ActiveRecord::RecordInvalid do
      new_match(1, true, 1, true).save!
    end
  end

  test "user_id_order" do
    assert_raises ActiveRecord::RecordInvalid do
      new_match(2, true, 1, true).save!
    end
  end
end
