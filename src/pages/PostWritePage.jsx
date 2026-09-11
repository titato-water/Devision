import * as React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { supabase } from '../lib/supabase.js';
import { useAuth } from '../hooks/useAuth.jsx';
import PostForm from '../components/post/PostForm.jsx';

/**
 * 태그 이름 배열을 DV_TAGS의 tag_id 배열로 변환한다. 없는 태그는 새로 생성한다.
 * @param {Array} tagNames - 태그 이름 배열
 * @returns {Promise<Array>} tag_id 배열
 */
async function resolveTagIds(tagNames) {
  const ids = [];
  for (const rawName of tagNames) {
    const name = rawName.trim();
    if (!name) continue;
    const { data: existing } = await supabase
      .from('DV_TAGS')
      .select('tag_id')
      .eq('name', name)
      .maybeSingle();
    if (existing) {
      ids.push(existing.tag_id);
      continue;
    }
    const { data: created } = await supabase
      .from('DV_TAGS')
      .insert({ name })
      .select('tag_id')
      .single();
    if (created) ids.push(created.tag_id);
  }
  return ids;
}

/**
 * PostWritePage 컴포넌트
 *
 * 게시글 작성(/posts/new)과 수정(/posts/:id/edit)을 함께 처리한다.
 *
 * Example usage:
 * <PostWritePage />
 */
function PostWritePage() {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState(null);
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!isEditMode) return;

    async function loadPost() {
      const { data } = await supabase
        .from('DV_POSTS')
        .select('post_id, user_id, title, category, content, DV_POST_TAGS(DV_TAGS(name))')
        .eq('post_id', id)
        .maybeSingle();

      if (!data || data.user_id !== user?.id) {
        navigate('/');
        return;
      }

      setInitialValues({
        title: data.title,
        category: data.category,
        content: data.content,
        tags: (data.DV_POST_TAGS ?? []).map((postTag) => postTag.DV_TAGS?.name).filter(Boolean),
      });
      setIsLoading(false);
    }

    loadPost();
  }, [id, isEditMode, navigate, user?.id]);

  async function handleSubmit({ title, category, tags, content }) {
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const tagIds = await resolveTagIds(tags);

      if (isEditMode) {
        const { error } = await supabase
          .from('DV_POSTS')
          .update({ title, category, content, updated_at: new Date().toISOString() })
          .eq('post_id', id);
        if (error) throw error;

        await supabase.from('DV_POST_TAGS').delete().eq('post_id', id);
        if (tagIds.length) {
          await supabase
            .from('DV_POST_TAGS')
            .insert(tagIds.map((tagId) => ({ post_id: Number(id), tag_id: tagId })));
        }
        navigate(`/posts/${id}`);
      } else {
        const { data: postRow, error } = await supabase
          .from('DV_POSTS')
          .insert({ user_id: user.id, title, category, content })
          .select('post_id')
          .single();
        if (error) throw error;

        if (tagIds.length) {
          await supabase
            .from('DV_POST_TAGS')
            .insert(tagIds.map((tagId) => ({ post_id: postRow.post_id, tag_id: tagId })));
        }
        navigate(`/posts/${postRow.post_id}`);
      }
    } catch (error) {
      setErrorMessage('저장에 실패했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress size={28} />
      </Box>
    );
  }

  return (
    <Box sx={{ flex: 1, py: { xs: 3, md: 5 } }}>
      <Container maxWidth="md">
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>
          {isEditMode ? '게시글 수정' : '게시글 작성'}
        </Typography>
        <PostForm
          initialValues={initialValues ?? {}}
          onSubmit={handleSubmit}
          submitLabel={isEditMode ? '수정' : '등록'}
          isSubmitting={isSubmitting}
          errorMessage={errorMessage}
        />
      </Container>
    </Box>
  );
}

export default PostWritePage;
