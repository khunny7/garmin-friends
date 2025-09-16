import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { friendPostsService } from '../services/firebaseService';

function FriendFinder() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    introduction: '',
    garminProfileUrl: '',
    location: '',
    activities: [],
    expiresAt: ''
  });

  // Sample data for development

  const activityOptions = [
    '러닝', '사이클링', '등산', '트레일러닝', '골프', '수영', '요가', '헬스', '테니스', '배드민턴'
  ];

  useEffect(() => {
    loadFriendPosts();
  }, []);

  const loadFriendPosts = async () => {
    try {
      setLoading(true);
      setError('');
      const friendPosts = await friendPostsService.getAll();
      setPosts(friendPosts);
    } catch (err) {
      console.error('Error loading friend posts:', err);
      setError('친구 찾기 게시글을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleActivityToggle = (activity) => {
    setFormData(prev => ({
      ...prev,
      activities: prev.activities.includes(activity)
        ? prev.activities.filter(a => a !== activity)
        : [...prev.activities, activity]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      
      // Create the friend post
      const newPost = await friendPostsService.create(formData, user);
      
      // Add to local state for immediate UI update
      setPosts(prev => [newPost, ...prev]);
      
      // Reset form
      setFormData({
        name: '',
        introduction: '',
        garminProfileUrl: '',
        location: '',
        activities: [],
        expiresAt: ''
      });
      setShowCreateForm(false);
      alert('친구 찾기 게시글이 등록되었습니다!');
    } catch (err) {
      console.error('Error creating friend post:', err);
      setError('게시글 작성에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (postDocId, postId) => {
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      const newLikeStatus = await friendPostsService.toggleLike(postDocId, user.uid);
      
      // Update local state for immediate UI feedback
      setPosts(prev => prev.map(post => {
        if (post.docId === postDocId) {
          const currentLikedBy = post.likedBy || [];
          return {
            ...post,
            likes: newLikeStatus ? post.likes + 1 : post.likes - 1,
            likedBy: newLikeStatus 
              ? [...currentLikedBy, user.uid]
              : currentLikedBy.filter(id => id !== user.uid)
          };
        }
        return post;
      }));
    } catch (err) {
      console.error('Error toggling like:', err);
      alert('좋아요 처리에 실패했습니다.');
    }
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const getDaysLeft = (expiresAt) => {
    const today = new Date();
    const diffTime = expiresAt - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="page">
        <div className="container">
          <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
            <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-sm)' }}>⌚</div>
            <p>친구 찾기 게시글을 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <div className="container">
          <h1 className="page-title">🤝 친구 찾기</h1>
          <p className="page-subtitle">
            가민 사용자들과 연결되어 함께 운동하고 소통해보세요
          </p>
        </div>
      </div>

      <div className="container">
        {/* Error Message */}
        {error && (
          <div style={{ 
            marginBottom: 'var(--spacing-lg)', 
            padding: 'var(--spacing-md)', 
            backgroundColor: '#fef2f2', 
            border: '1px solid #fecaca', 
            borderRadius: 'var(--radius-md)', 
            color: '#dc2626' 
          }}>
            {error}
          </div>
        )}

        {/* Create Post Button */}
        <div style={{ marginBottom: 'var(--spacing-lg)' }}>
          {user ? (
            <button 
              className="btn btn-primary"
              onClick={() => setShowCreateForm(true)}
              style={{ width: '100%' }}
            >
              <span style={{ marginRight: 'var(--spacing-xs)' }}>✍️</span>
              나의 가민 프로필 공유하기
            </button>
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-lg)' }}>
              <p style={{ marginBottom: 'var(--spacing-md)' }}>
                친구 찾기 게시글을 작성하려면 로그인이 필요합니다.
              </p>
              <button className="btn btn-primary">로그인하기</button>
            </div>
          )}
        </div>

        {/* Create Form Modal */}
        {showCreateForm && (
          <div style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            backgroundColor: 'rgba(0,0,0,0.5)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            zIndex: 1000,
            padding: 'var(--spacing-md)'
          }}>
            <div className="card" style={{ 
              maxWidth: '500px', 
              width: '100%', 
              maxHeight: '90vh', 
              overflowY: 'auto' 
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: 'var(--spacing-lg)' 
              }}>
                <h3>친구 찾기 게시글 작성</h3>
                <button 
                  onClick={() => setShowCreateForm(false)}
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    fontSize: '1.5rem', 
                    cursor: 'pointer' 
                  }}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 'var(--spacing-md)' }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: 'var(--spacing-xs)', 
                    fontWeight: '500' 
                  }}>
                    이름 *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="운동할 때 부를 이름을 입력하세요"
                    required
                    style={{
                      width: '100%',
                      padding: 'var(--spacing-sm)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: 'var(--font-size-base)'
                    }}
                  />
                </div>

                <div style={{ marginBottom: 'var(--spacing-md)' }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: 'var(--spacing-xs)', 
                    fontWeight: '500' 
                  }}>
                    자기소개 *
                  </label>
                  <textarea
                    name="introduction"
                    value={formData.introduction}
                    onChange={handleInputChange}
                    placeholder="자신을 소개하고 어떤 운동을 함께 하고 싶은지 적어주세요"
                    required
                    rows={4}
                    style={{
                      width: '100%',
                      padding: 'var(--spacing-sm)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: 'var(--font-size-base)',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <div style={{ marginBottom: 'var(--spacing-md)' }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: 'var(--spacing-xs)', 
                    fontWeight: '500' 
                  }}>
                    가민 커넥트 프로필 URL *
                  </label>
                  <input
                    type="url"
                    name="garminProfileUrl"
                    value={formData.garminProfileUrl}
                    onChange={handleInputChange}
                    placeholder="https://connect.garmin.com/modern/profile/..."
                    required
                    style={{
                      width: '100%',
                      padding: 'var(--spacing-sm)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: 'var(--font-size-base)'
                    }}
                  />
                  <small style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                    가민 커넥트에서 프로필 → 공유 → 링크 복사
                  </small>
                </div>

                <div style={{ marginBottom: 'var(--spacing-md)' }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: 'var(--spacing-xs)', 
                    fontWeight: '500' 
                  }}>
                    활동 지역
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="예: 서울시 강남구"
                    style={{
                      width: '100%',
                      padding: 'var(--spacing-sm)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: 'var(--font-size-base)'
                    }}
                  />
                </div>

                <div style={{ marginBottom: 'var(--spacing-md)' }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: 'var(--spacing-sm)', 
                    fontWeight: '500' 
                  }}>
                    관심 활동
                  </label>
                  <div style={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: 'var(--spacing-xs)' 
                  }}>
                    {activityOptions.map(activity => (
                      <button
                        key={activity}
                        type="button"
                        onClick={() => handleActivityToggle(activity)}
                        style={{
                          padding: 'var(--spacing-xs) var(--spacing-sm)',
                          border: `1px solid ${formData.activities.includes(activity) ? 'var(--primary-color)' : 'var(--border-color)'}`,
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: formData.activities.includes(activity) ? 'var(--primary-color)' : 'transparent',
                          color: formData.activities.includes(activity) ? 'white' : 'var(--text-primary)',
                          fontSize: 'var(--font-size-sm)',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        {activity}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: 'var(--spacing-xs)', 
                    fontWeight: '500' 
                  }}>
                    게시글 만료일 *
                  </label>
                  <input
                    type="date"
                    name="expiresAt"
                    value={formData.expiresAt}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    required
                    style={{
                      width: '100%',
                      padding: 'var(--spacing-sm)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: 'var(--font-size-base)'
                    }}
                  />
                  <small style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                    이 날짜 이후 게시글이 자동으로 삭제됩니다
                  </small>
                </div>

                <div style={{ 
                  display: 'flex', 
                  gap: 'var(--spacing-sm)', 
                  justifyContent: 'flex-end' 
                }}>
                  <button 
                    type="button" 
                    onClick={() => setShowCreateForm(false)}
                    className="btn btn-secondary"
                  >
                    취소
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? '작성 중...' : '게시글 작성'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Posts List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
          {posts.map(post => {
            const daysLeft = getDaysLeft(post.expiresAt);
            const isExpiring = daysLeft <= 7;
            
            return (
              <div key={post.id} className="card">
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start',
                  marginBottom: 'var(--spacing-md)' 
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                    <div style={{ 
                      width: '50px', 
                      height: '50px', 
                      borderRadius: '50%', 
                      backgroundColor: 'var(--secondary-color)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5rem'
                    }}>
                      ⌚
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: 'var(--font-size-lg)' }}>{post.name}</h3>
                      <p style={{ 
                        margin: 0, 
                        fontSize: 'var(--font-size-sm)', 
                        color: 'var(--text-secondary)' 
                      }}>
                        {formatDate(post.createdAt)}
                        {post.location && ` • ${post.location}`}
                      </p>
                    </div>
                  </div>
                  
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ 
                      fontSize: 'var(--font-size-sm)', 
                      color: isExpiring ? 'var(--danger-color)' : 'var(--text-secondary)',
                      fontWeight: isExpiring ? '600' : 'normal'
                    }}>
                      {daysLeft > 0 ? `${daysLeft}일 남음` : '만료됨'}
                    </div>
                  </div>
                </div>

                <p style={{ 
                  marginBottom: 'var(--spacing-md)', 
                  lineHeight: 1.6,
                  fontSize: 'var(--font-size-base)'
                }}>
                  {post.introduction}
                </p>

                {post.activities.length > 0 && (
                  <div style={{ marginBottom: 'var(--spacing-md)' }}>
                    <div style={{ 
                      display: 'flex', 
                      flexWrap: 'wrap', 
                      gap: 'var(--spacing-xs)' 
                    }}>
                      {post.activities.map(activity => (
                        <span 
                          key={activity}
                          style={{
                            padding: 'var(--spacing-xs) var(--spacing-sm)',
                            backgroundColor: 'var(--accent-color)',
                            color: 'white',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: 'var(--font-size-sm)',
                            fontWeight: '500'
                          }}
                        >
                          {activity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  paddingTop: 'var(--spacing-md)',
                  borderTop: '1px solid var(--border-color)'
                }}>
                  <a
                    href={post.garminProfileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                    style={{ textDecoration: 'none' }}
                  >
                    🔗 가민 프로필 보기
                  </a>
                  
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 'var(--spacing-sm)' 
                  }}>
                    <button 
                      onClick={() => handleLike(post.docId, post.id)}
                      style={{ 
                        background: 'none', 
                        border: 'none', 
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--spacing-xs)',
                        color: (post.likedBy || []).includes(user?.uid) ? 'var(--primary-color)' : 'var(--text-secondary)',
                        fontSize: 'var(--font-size-sm)'
                      }}
                    >
                      ❤️ {post.likes}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {posts.length === 0 && (
          <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
            <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>🤝</div>
            <h3>아직 친구 찾기 게시글이 없습니다</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-lg)' }}>
              첫 번째로 가민 프로필을 공유해보세요!
            </p>
            {user && (
              <button 
                className="btn btn-primary"
                onClick={() => setShowCreateForm(true)}
              >
                게시글 작성하기
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default FriendFinder;