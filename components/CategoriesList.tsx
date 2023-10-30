import Link from 'next/link'
import styles from './styles.module.css'
import { TCategory } from '@/app/types'

const getCategories = async (): Promise<TCategory[] | null> => {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/categories`)

    if (res.ok) {
      const categories = await res.json()
      return categories
    }
  } catch (error) {
    console.log(error)
  }
  return null
}
const CategoriesList = async () => {
  const categories = await getCategories()

  return (
    <div className={styles.CategoriesList}>
      {categories &&
        categories.map((category) => (
          <div key={category.id}>
            <ul>
              <li>
                <Link href={`/categories/${category.catName}`} className="">
                  {category.catName}
                </Link>
              </li>
            </ul>
          </div>
        ))}
    </div>
  )
}

export default CategoriesList
